import 'dotenv/config';
import PuppeteerNavigator from '@src/automation/puppeteer/navigator';
import { getRandomDesktopUserAgent } from '@src/automation/userAgents';
import CsvIngester from '@src/ingester/csvIngester';
import { parseAccount } from '@src/parser/account';
import UpworkAutomationService from '@src/automation/puppeteer/upworkAutomationService';
import path from 'path';

async function main(): Promise<void> {
  const csvFilePath = path.join(process.cwd(), 'assets/accounts.csv');
  const photoPath = path.join(process.cwd(), 'assets/photo.jpg');
  const csvIngester = new CsvIngester(csvFilePath);
  const accounts = await csvIngester.readSync(parseAccount);

  console.log('🚀 Starting signup automation...');
  console.log(`📊 Found ${accounts.length} accounts to process`);

  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    console.log(`\n👤 Processing account ${i + 1}/${accounts.length}: ${account.email} [${account.country}]`);

    console.log('🔧 Setting up browser...');
    const navigator = await PuppeteerNavigator.create();
    await navigator.setUserAgent(getRandomDesktopUserAgent());
    const upworkAutomationService = new UpworkAutomationService(navigator);
    let shouldLogout = false;

    try {
      console.log('🔐 Logging in...');
      await upworkAutomationService.retry(async () => {
        console.log('🌐 Navigating to home page...');
        await upworkAutomationService.gotoHomePage();

        console.log('🌐 Navigating to login page...');
        await upworkAutomationService.gotoLoginPage();

        await upworkAutomationService.login(account.email, account.password);
      }, 2);
      console.log('✅ Login successful');
      shouldLogout = true;

      console.log('📝 Going to create profile page...');
      await upworkAutomationService.gotoCreateProfilePage();

      console.log('🎯 Getting started with profile setup...');
      await upworkAutomationService.gettingStartedProfile();

      console.log('👔 Filling profile information...');
      await upworkAutomationService.fillProfile(account);

      console.log('💼 Filling work experience...');
      await upworkAutomationService.fillExperience(account);

      console.log('🎓 Filling education information...');
      await upworkAutomationService.fillEducation(account);

      console.log('🗣️ Setting language proficiency...');
      await upworkAutomationService.fillLanguageProficiency();

      console.log('📄 Filling bio description...');
      await upworkAutomationService.fillBioDescription(account);

      console.log('💰 Setting hourly rate...');
      await upworkAutomationService.fillHourlyRate();

      console.log('📸 Uploading photo and filling personal information...');
      await upworkAutomationService.fillPersonalInformation(account, photoPath);

      console.log('🔄 Submitting profile...');
      await upworkAutomationService.submitProfile();

      console.log('🔒 Logging out...');
      await upworkAutomationService.gotoLogoutPage();

      console.log('✅ Account setup completed successfully!');
      console.log('⏳ Waiting 10 seconds before closing...');
      await navigator.sleep(10000);

      console.log('📋 Account details:', {
        email: account.email,
        name: `${account.first_name} ${account.last_name}`,
        role: account.role,
        country: account.country
      });

    } catch (error) {
      console.error(`❌ Error processing account ${account.email}:`, error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');

      if (shouldLogout) {
        console.log('🔒 Logging out...');
        await upworkAutomationService.gotoLogoutPage();
      }

      console.log('⏳ Waiting 5 seconds before closing...');
      await navigator.sleep(5000);
    } finally {
      console.log('🔒 Closing browser...');
      await navigator.close();
    }
  }

  console.log('🎉 Signup automation completed for all accounts');
}

// Run the main function
main().catch(console.error);