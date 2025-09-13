
// Using shortcut paths
import PuppeteerNavigator from '@src/automation/puppeteer/navigator';
import { UserAgents } from '@src/automation/userAgents';

async function main(): Promise<void> {
  console.log('Starting signup automation...');
  const navigator = await PuppeteerNavigator.create();

  try {
    await navigator.setUserAgent(UserAgents.CHROME_MACOS);
    await navigator.ignoreImages();
    await navigator.changePage('https://whoer.net/');

    console.log('Page loaded successfully');
    await navigator.sleep(60000);
    // Add your automation logic here

  } catch (error) {
    console.error('Error during automation:', error);
  } finally {
    await navigator.close();
  }
}

// Run the main function
main().catch(console.error);