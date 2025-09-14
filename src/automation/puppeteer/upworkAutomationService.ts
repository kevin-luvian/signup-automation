import PuppeteerNavigator from "./navigator";
import path from 'path';
import fs from 'fs';
import { Account } from '@src/parser/account';

class UpworkAutomationService {
    private navigator: PuppeteerNavigator;
    private basePathError: string;

    constructor(navigator: PuppeteerNavigator) {
        this.navigator = navigator;
        this.basePathError = path.join(process.cwd(), 'assets/errors');

        if (!fs.existsSync(this.basePathError)) {
            fs.mkdirSync(this.basePathError);
        }
    }

    async gotoCheckPage() {
        try {
            await this.navigator.changePage('https://bot.sannysoft.com/', 10000);
            await this.navigator.randomSleep(500, 3000);
        } catch (error) {
            await this.navigator.logPage(this.basePathError, 'navigate_check_page');
            console.error('Error going to check page');
        }
        await this.navigator.sleep(1000000)
    }

    async gotoHomePage() {
        try {
            await this.navigator.changePage('https://www.upwork.com/', 10000);
            await this.navigator.randomSleep(500, 3000);
        } catch (error) {
            await this.navigator.logPage(this.basePathError, 'navigate_home_page');
            console.error('Error going to home page');
        }
    }

    async gotoLoginPage() {
        try {
            await this.navigator.changePage('https://www.upwork.com/ab/account-security/login', 100000);
            await this.navigator.randomSleep(500, 3000);
        } catch (error) {
            await this.navigator.logPage(this.basePathError, 'navigate_login_page');
            console.error('Error going to login page');
            throw error;
        }
    }

    async gotoLogoutPage() {
        try {
            await this.navigator.changePage('https://www.upwork.com/ab/account-security/logout', 100000);
            await this.navigator.randomSleep(500, 3000);

            const buttonLogout = await this.navigator.waitForSelector('button::-p-text("Log Out")');
            if (!buttonLogout) {
                await this.navigator.logPage(this.basePathError, 'button_logout');
                throw new Error('Log out button not found');
            }
            await buttonLogout.click();
            await this.navigator.randomSleep(500, 3000);
        } catch (error) {
            await this.navigator.logPage(this.basePathError, 'navigate_logout_page');
            console.error('Error going to logout page');
            throw error;
        }
    }

    async gotoCreateProfilePage() {
        try {
            await this.navigator.changePage('https://www.upwork.com/nx/create-profile/welcome');
            await this.navigator.randomSleep(500, 3000);
        } catch (error) {
            await this.navigator.logPage(this.basePathError, 'navigate_create_profile_page');
            console.error('Error going to create profile page');
            throw error;
        }
    }

    async retry(fn: () => Promise<void>, retries: number = 3, delayMs: number = 10000): Promise<void> {
        let lastError: any;
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                await fn();
                return;
            } catch (error) {
                lastError = error;
                if (attempt < retries - 1) {
                    await this.navigator.sleep(delayMs);
                }
            }
        }
        throw lastError;
    }

    async login(email: string, password: string) {
        const loginUsername = await this.navigator.waitForSelector('#login_username');
        if (!loginUsername) {
            await this.navigator.logPage(this.basePathError, 'login_username');
            throw new Error('Login username element not found');
        }
        await loginUsername.type(email, { delay: 100 });

        const buttonContinue = await this.navigator.waitForSelector('button::-p-text("Continue")');
        if (!buttonContinue) {
            await this.navigator.logPage(this.basePathError, 'button_continue');
            throw new Error('Continue button not found');
        }
        await buttonContinue.click();
        await this.navigator.randomSleep(1000, 3000);

        const loginPassword = await this.navigator.waitForSelector('#login_password');
        if (!loginPassword) {
            await this.navigator.logPage(this.basePathError, 'login_password');
            throw new Error('Login password element not found');
        }
        await loginPassword.type(password, { delay: 100 });

        const buttonClosePopup = await this.navigator.waitForSelector("::-p-xpath(//button[@aria-label='Close'])")
        if (buttonClosePopup) {
            await buttonClosePopup.click();
        } else {
            await this.navigator.logPage(this.basePathError, 'button_close_popup');
        }

        const buttonLogIn = await this.navigator.waitForSelector("::-p-xpath(//button[contains(text(), 'Log in')])");
        if (!buttonLogIn) {
            await this.navigator.logPage(this.basePathError, 'button_log_in');
            throw new Error('Log in button not found');
        }
        await buttonLogIn.click();

        await this.navigator.sleep(500);
        await this.navigator.page.waitForNavigation({ waitUntil: 'load' });
        await this.navigator.sleep(3000);
    }

    async gettingStartedProfile() {
        await this.navigator.moveMouseRandomly();

        const buttonGetStarted = await this.navigator.waitForSelector("::-p-xpath(//button[normalize-space()='Get started'])");
        if (!buttonGetStarted) {
            await this.navigator.logPage(this.basePathError, 'button_get_started');
            throw new Error('Get started button not found');
        }
        await buttonGetStarted.click({ count: 2, delay: 1000 });
        await this.navigator.randomSleep(1000, 3000);

        const iamExpertInput = await this.navigator.waitForSelectors([
            "::-p-xpath(//input[@value='FREELANCED_BEFORE'])",
            "::-p-xpath(//div[@data-qa='button-box' and contains(., 'I am an expert')])",
        ])
        if (!iamExpertInput) {
            await this.navigator.logPage(this.basePathError, 'i_am_an_expert_input');
            throw new Error('I am an expert input not found');
        }
        await iamExpertInput.click({ delay: 500 });

        let buttonNext = await this.navigator.waitForSelector("::-p-xpath(//button[text()='Next'])");
        if (!buttonNext) {
            await this.navigator.logPage(this.basePathError, 'button_next');
            throw new Error('Button next not found');
        }
        await buttonNext.click({ delay: 500 });
        await this.navigator.sleep(3000);

        const toGetExperienceInput = await this.navigator.waitForSelectors([
            "::-p-xpath(//input[@value='GET_EXPERIENCE'])",
            "::-p-xpath(//div[@data-qa='button-box' and contains(., 'To get experience')])",
        ])
        if (!toGetExperienceInput) {
            await this.navigator.logPage(this.basePathError, 'to_get_experience_input');
            throw new Error('To get experience input not found');
        }
        await toGetExperienceInput.click({ delay: 500 });

        buttonNext = await this.navigator.waitForSelector("::-p-xpath(//button[text()='Next'])");
        if (!buttonNext) {
            await this.navigator.logPage(this.basePathError, 'button_next');
            throw new Error('Button next not found');
        }
        await buttonNext.click({ delay: 500 });
        await this.navigator.sleep(3000);

        const toGetOpportunitiesInput = await this.navigator.waitForSelectors([
            "::-p-xpath(//div[@data-qa='button-box' and contains(., 'I’d like to find opportunities myself')])",
            "::-p-xpath(//div[@data-qa='button-box' and contains(., 'find opportunities')])",
        ])
        if (!toGetOpportunitiesInput) {
            await this.navigator.logPage(this.basePathError, 'to_get_opportunities_input');
            throw new Error('To get opportunities input not found');
        }
        await toGetOpportunitiesInput.click({ delay: 500 });

        const buttonCreateProfile = await this.navigator.waitForSelectors([
            "::-p-xpath(//button[contains(., 'create a profile')])",
            "::-p-xpath(//button[contains(., 'Create a profile')])",
            "::-p-xpath(//button[contains(., 'Next') and not(@disabled)])",
        ]);
        if (!buttonCreateProfile) {
            await this.navigator.logPage(this.basePathError, 'button_create_profile');
            throw new Error('Button create profile not found');
        }
        await buttonCreateProfile.click({ delay: 500 });
        await this.navigator.sleep(3000);
    }

    async fillProfile(account: Account) {
        await this.navigator.moveMouseRandomly();

        const buttonFilloutManual = await this.navigator.waitForSelector(
            "::-p-xpath(//button[contains(., 'Fill out manually')])"
        )
        if (!buttonFilloutManual) {
            await this.navigator.logPage(this.basePathError, 'button_fillout_manual');
            throw new Error('Button to fill out manually not found');
        }
        await buttonFilloutManual.click({ delay: 500 });
        await this.navigator.sleep(3000);

        const categoryInput = await this.navigator.waitForSelector(
            "::-p-xpath(//li[contains(., 'Software Dev')])"
        );
        if (!categoryInput) {
            await this.navigator.logPage(this.basePathError, 'category_input');
            throw new Error('Category Software Dev not found');
        }
        await categoryInput.click({ delay: 100 });

        const labelInput = await this.navigator.waitForSelector(
            "::-p-xpath(//label[contains(., 'AI Apps & Integration')])"
        );
        if (!labelInput) {
            await this.navigator.logPage(this.basePathError, 'label_input');
            throw new Error('Label AI Apps & Integration not found');
        }
        await labelInput.click({ delay: 100 });

        const buttonNext = await this.navigator.waitForSelector(
            "::-p-xpath(//button[contains(., 'Next')])"
        );
        if (!buttonNext) {
            await this.navigator.logPage(this.basePathError, 'button_next');
            throw new Error('Button next not found');
        }
        await buttonNext.click({ delay: 500 });
        await this.navigator.sleep(3000);

        const tokenContainer = await this.navigator.waitForSelector(
            "::-p-xpath(//div[@class='token-container'])"
        );
        if (!tokenContainer) {
            await this.navigator.logPage(this.basePathError, 'token_container');
            throw new Error('Token container not found');
        }

        const firstToken = await tokenContainer.$("div");
        if (!firstToken) {
            await this.navigator.logPage(this.basePathError, 'first_token');
            throw new Error('First token not found');
        }
        await this.navigator.highlightElement(firstToken);
        await firstToken.click({ delay: 100 });

        await this.navigator.highlightElement(buttonNext);
        await buttonNext.click({ delay: 500 });
        await this.navigator.sleep(3000);

        const professionalRoleInput = await this.navigator.getAriaLabelledby(
            `::-p-xpath(//label[contains(., 'Your professional role')])`
        );
        if (!professionalRoleInput) {
            await this.navigator.logPage(this.basePathError, 'professional_skill_input');
            throw new Error('Professional skill input not found');
        }
        await professionalRoleInput.type(account.role, { delay: 100 });
        await this.navigator.highlightElement(buttonNext);
        await buttonNext.click({ delay: 500 });
        await this.navigator.sleep(3000);
    }

    async fillExperience(account: Account) {
        await this.navigator.moveMouseRandomly();

        const experienceInput = await this.navigator.getAriaLabelledby(
            `::-p-xpath(//h4[contains(., 'Add experience')])`
        );
        if (!experienceInput) {
            await this.navigator.logPage(this.basePathError, 'experience_input');
            throw new Error('Experience input not found');
        }
        await experienceInput.click({ delay: 500 });
        await this.navigator.sleep(500);

        {
            const titleContainer = await this.navigator.waitForSelector(
                `::-p-xpath(//label[contains(., 'Title')]/parent::div)`
            );
            const titleInput = await titleContainer?.$("input");
            if (!titleInput) {
                await this.navigator.logPage(this.basePathError, 'title_input');
                throw new Error('Title input not found');
            }
            await titleInput.focus()
            await titleInput.click({ delay: 500 });
            await titleInput.type(account.role, { delay: 100 });
            this.navigator.page.keyboard.press('Enter');
        }

        {
            const companyContainer = await this.navigator.waitForSelector(
                `::-p-xpath(//label[contains(., 'Company')]/parent::div)`
            );
            const companyInput = await companyContainer?.$("input");
            if (!companyInput) {
                await this.navigator.logPage(this.basePathError, 'company_input');
                throw new Error('Company input not found');
            }
            await companyInput.click({ delay: 500 });
            await companyInput.type(account.ex_company, { delay: 100 });
            this.navigator.page.keyboard.press('Enter');
        }

        {
            const locationContainer = await this.navigator.waitForSelector(
                `::-p-xpath(//label[contains(., 'Location')]/parent::div)`
            );
            const locationInput = await locationContainer?.$("input");
            if (!locationInput) {
                await this.navigator.logPage(this.basePathError, 'location_input');
                throw new Error('Location input not found');
            }
            await locationInput.click({ delay: 500 });
            await locationInput.type(account.city, { delay: 100 });
            this.navigator.page.keyboard.press('Enter');
        }

        {
            const checkboxLabel = await this.navigator.waitForSelector(
                "::-p-xpath(//label[contains(., 'I am currently working in this role')])"
            )
            if (!checkboxLabel) {
                await this.navigator.logPage(this.basePathError, 'checkbox_label');
                throw new Error('Checkbox label not found');
            }
            await checkboxLabel.click({ delay: 500 });
        }

        {
            const startDateMonthInput = await this.navigator.getAriaLabelledby(
                "::-p-xpath(//label[contains(., 'Start date month')])"
            );
            if (!startDateMonthInput) {
                await this.navigator.logPage(this.basePathError, 'start_date_month_input');
                throw new Error('Start date month input not found');
            }
            await startDateMonthInput.click({ delay: 500 });

            const startDateMonthOption = await this.navigator.waitForSelector(
                `::-p-xpath(//li[contains(., '${account.ex_start_month}')])`
            );
            if (!startDateMonthOption) {
                await this.navigator.logPage(this.basePathError, 'start_date_month_option');
                throw new Error('Start date month option not found');
            }
            await startDateMonthOption.click({ delay: 500 });
            await this.navigator.sleep(1000);
        }

        {
            const startDateYearInput = await this.navigator.getAriaLabelledby(
                "::-p-xpath(//label[contains(., 'Start date year')])"
            );
            if (!startDateYearInput) {
                await this.navigator.logPage(this.basePathError, 'start_date_year_input');
                throw new Error('Start date year input not found');
            }
            await startDateYearInput.click({ delay: 500 });
            await this.navigator.sleep(1000);
            await this.navigator.page.keyboard.type(account.ex_start_year, { delay: 100 });
            await this.navigator.sleep(1000);

            const startDateYearOption = await this.navigator.waitForSelector(
                `::-p-xpath(//li[contains(., '${account.ex_start_year}')])`
            );
            if (!startDateYearOption) {
                await this.navigator.logPage(this.basePathError, 'start_date_year_option');
                throw new Error('Start date year option not found');
            }
            await startDateYearOption.focus();
            await startDateYearOption.click({ delay: 500 });
            await this.navigator.sleep(1000);
        }

        const buttonSave = await this.navigator.waitForSelector("::-p-xpath(//button[text()='Save'])");
        if (!buttonSave) {
            await this.navigator.logPage(this.basePathError, 'button_save');
            throw new Error('Button save not found');
        }
        await buttonSave.click({ delay: 500 });
        await this.navigator.sleep(1000);

        const buttonNext = await this.navigator.waitForSelectors([
            "::-p-xpath(//button[contains(., 'add your education')])",
            "::-p-xpath(//button[contains(., 'Add education')])",
            "::-p-xpath(//button[contains(., 'Next') and not(@disabled)])",
        ]);
        if (!buttonNext) {
            await this.navigator.logPage(this.basePathError, 'button_next');
            throw new Error('Button next not found');
        }
        await buttonNext.click({ delay: 500 });
        await this.navigator.sleep(3000);
    }



    async fillEducation(account: Account) {
        await this.navigator.moveMouseRandomly();

        const educationInput = await this.navigator.getAriaLabelledby(
            `::-p-xpath(//h4[contains(., 'Add education')])`
        );
        if (!educationInput) {
            await this.navigator.logPage(this.basePathError, 'education_input');
            throw new Error('Education input not found');
        }
        await educationInput.click({ delay: 500 });
        await this.navigator.sleep(3000);

        {
            const schoolInput = await this.navigator.waitForSelector(
                `::-p-xpath(//label[contains(., 'School')]/parent::div//input)`
            );
            if (!schoolInput) {
                await this.navigator.logPage(this.basePathError, 'school_input');
                throw new Error('School input not found');
            }
            await schoolInput.click({ delay: 500 });
            await schoolInput.type(account.edu_school, { delay: 100 });
        }

        {
            const degreeContainer = await this.navigator.waitForSelector(
                `::-p-xpath(//label[contains(., 'Degree')]/parent::div)`
            );
            const degreeInput = await degreeContainer?.$("input");
            if (!degreeInput) {
                await this.navigator.logPage(this.basePathError, 'degree_input');
                throw new Error('Degree input not found');
            }
            await degreeInput.click({ delay: 500 });
            await degreeInput.type(account.edu_degree, { delay: 100 });
            await this.navigator.sleep(1000);

            const degreeLabel = await this.navigator.waitForSelector(
                `::-p-xpath(//ul[@aria-labelledby='degree-label']//li)`
            );
            if (!degreeLabel) {
                await this.navigator.logPage(this.basePathError, 'degree_label');
                throw new Error(`Degree label for ${account.edu_degree} not found`);
            }
            await degreeLabel.click({ delay: 500 });
            await this.navigator.sleep(500);
        }

        {
            const fieldOfStudyContainer = await this.navigator.waitForSelector(
                `::-p-xpath(//label[contains(., 'Field of Study')]/parent::div)`
            );
            const fieldOfStudyInput = await fieldOfStudyContainer?.$("input");
            if (!fieldOfStudyInput) {
                await this.navigator.logPage(this.basePathError, 'field_of_study_input');
                throw new Error('Field of study input not found');
            }
            await fieldOfStudyInput.click({ delay: 500 });
            await fieldOfStudyInput.type(account.edu_field_of_study, { delay: 100 });

            const fieldOfStudyLabel = await this.navigator.waitForSelector(
                `::-p-xpath(//label[contains(., 'Field of Study')])`
            );
            await fieldOfStudyLabel?.click({ delay: 500 });
            await this.navigator.sleep(500);
        }

        {
            try {
                let dateAttendedFromContainer = await this.navigator.waitForSelector(
                    "::-p-xpath(//div[@data-qa='year-from'])"
                );
                await dateAttendedFromContainer!.click({ delay: 100 });
                await this.navigator.sleep(1000);

                const searchInput = await dateAttendedFromContainer!.$("::-p-xpath(.//input[@type='search'])");
                if (!searchInput) {
                    throw new Error('Search input not found');
                }

                await this.navigator.highlightElement(searchInput!);
                await searchInput!.focus();
                await searchInput!.click({ delay: 100 });
                await searchInput!.type(account.edu_start_year, { delay: 100 });

                dateAttendedFromContainer = await this.navigator.waitForSelector(
                    "::-p-xpath(//div[@data-qa='year-from'])"
                );
                const option = await dateAttendedFromContainer!.$(`::-p-xpath(.//li[contains(., '${account.edu_start_year}')])`);
                await this.navigator.highlightElement(option!);
                await option!.click({ delay: 100 });
                await this.navigator.sleep(1000);
            } catch (error) {
                await this.navigator.logPage(this.basePathError, 'date_attended_from_input');
                throw new Error(`Error filling education start year. ${error}`);
            }
        }

        {
            try {
                let dateAttendedToContainer = await this.navigator.waitForSelector(
                    "::-p-xpath(//div[@data-qa='year-to'])"
                );
                await dateAttendedToContainer!.click({ delay: 100 });

                const dateAttendedToDropdown = await dateAttendedToContainer!.$(
                    "::-p-xpath(.//div[@aria-controls='dropdown-menu'])"
                )
                await dateAttendedToDropdown!.click({ delay: 100 });
                await this.navigator.sleep(1000);

                const searchInput = await dateAttendedToContainer!.$("::-p-xpath(.//input[@type='search'])");
                if (!searchInput) {
                    throw new Error('Search input not found');
                }

                await this.navigator.highlightElement(searchInput!);
                await searchInput!.focus();
                await searchInput!.click({ delay: 100 });
                await searchInput!.type(account.edu_end_year, { delay: 100 });

                dateAttendedToContainer = await this.navigator.waitForSelector(
                    "::-p-xpath(//div[@data-qa='year-to'])"
                );
                const option = await dateAttendedToContainer!.$(`::-p-xpath(.//li[contains(., '${account.edu_end_year}')])`);
                await this.navigator.highlightElement(option!);
                await option!.click({ delay: 100 });
                await this.navigator.sleep(1000);
            } catch (error) {
                await this.navigator.logPage(this.basePathError, 'date_attended_to_input');
                throw new Error(`Error filling education end year. ${error}`);
            }
        }

        const buttonSave = await this.navigator.waitForSelector("::-p-xpath(//button[text()='Save'])");
        if (!buttonSave) {
            await this.navigator.logPage(this.basePathError, 'button_save');
            throw new Error('Button save not found');
        }
        await buttonSave.click({ delay: 500 });
        await this.navigator.sleep(1000);

        const buttonNext = await this.navigator.waitForSelectors([
            "::-p-xpath(//button[contains(., 'Next, add languages')])",
            "::-p-xpath(//button[contains(., 'Add languages')])",
            "::-p-xpath(//button[contains(., 'Next') and not(@disabled)])",
        ]);
        if (!buttonNext) {
            await this.navigator.logPage(this.basePathError, 'button_next');
            throw new Error('Button next not found');
        }
        await buttonNext.click({ delay: 500 });
        await this.navigator.sleep(3000);
    }

    async fillLanguageProficiency() {
        await this.navigator.moveMouseRandomly();

        const languageProficiencyInput = await this.navigator.getAriaLabelledby(
            `::-p-xpath(//label[contains(., 'Proficiency')])`
        );
        if (!languageProficiencyInput) {
            await this.navigator.logPage(this.basePathError, 'language_proficiency_input');
            throw new Error('Language proficiency input not found');
        }

        await languageProficiencyInput.click({ delay: 500 });
        await this.navigator.sleep(1000);
        const languageProficiencyContainer = await this.navigator.waitForSelector(
            `::-p-xpath(//label[contains(., 'Proficiency')]/parent::div)`
        );
        const fluentOption = await languageProficiencyContainer?.$("::-p-xpath(.//li[contains(., 'Fluent')])");
        if (!fluentOption) {
            await this.navigator.logPage(this.basePathError, 'fluent_option');
            throw new Error('Fluent option not found');
        }
        await this.navigator.highlightElement(fluentOption!);
        await fluentOption.click({ delay: 500 });
        await this.navigator.sleep(1000);

        const buttonNext = await this.navigator.waitForSelectors([
            "::-p-xpath(//button[contains(., 'Next, write an overview')])",
            "::-p-xpath(//button[contains(., 'Write an overview')])",
            "::-p-xpath(//button[contains(., 'Next') and not(@disabled)])",
        ]);
        if (!buttonNext) {
            await this.navigator.logPage(this.basePathError, 'button_next');
            throw new Error('Button next not found');
        }
        await buttonNext.click({ delay: 500 });
        await this.navigator.sleep(3000);
    }

    async fillBioDescription(account: Account) {
        await this.navigator.moveMouseRandomly();

        const bioDescriptionInput = await this.navigator.waitForSelectors([
            `::-p-xpath(//textarea[@aria-labelledby='overview-label'])`,
            `::-p-xpath(//textarea)`,
        ]);
        if (!bioDescriptionInput) {
            await this.navigator.logPage(this.basePathError, 'bio_description_input');
            throw new Error('Bio description input not found');
        }
        await bioDescriptionInput.type(account.bio_description, { delay: 50 });
        await this.navigator.sleep(1000);

        const buttonNext = await this.navigator.waitForSelectors([
            "::-p-xpath(//button[contains(., 'Next, set your rate')])",
            "::-p-xpath(//button[contains(., 'Set your rate')])",
            "::-p-xpath(//button[contains(., 'Next') and not(@disabled)])",
        ]);
        if (!buttonNext) {
            await this.navigator.logPage(this.basePathError, 'button_next');
            throw new Error('Button next not found');
        }
        await buttonNext.click({ delay: 500 });
        await this.navigator.sleep(3000);
    }

    async fillHourlyRate() {
        await this.navigator.moveMouseRandomly();

        const hourlyInput = await this.navigator.waitForSelectors([
            `::-p-xpath(
                (//div[contains(., "Hourly rate")])[last()-1] 
                //input    
            )`,
            `::-p-xpath(//input[contains(@aria-describedby, 'hourly-rate-description')])`
        ]);
        if (!hourlyInput) {
            await this.navigator.logPage(this.basePathError, 'hourly_input');
            throw new Error('Hourly input not found');
        }
        await hourlyInput.type('100', { delay: 50 });
        await this.navigator.sleep(1000);

        const buttonNext = await this.navigator.waitForSelectors([
            "::-p-xpath(//button[contains(., 'Next, add your photo and location')])",
            "::-p-xpath(//button[contains(., 'Add your photo and location')])",
            "::-p-xpath(//button[contains(., 'Next') and not(@disabled)])",
        ]);
        if (!buttonNext) {
            await this.navigator.logPage(this.basePathError, 'button_next');
            throw new Error('Button next not found');
        }
        await buttonNext.click({ delay: 500 });
        await this.navigator.sleep(3000);
    }

    async fillPersonalInformation(account: Account, photoPath: string) {
        await this.navigator.moveMouseRandomly();

        const dateOfBirthLabel = await this.navigator.waitForSelector(
            `::-p-xpath(//label[contains(., 'Date of Birth')])`
        );
        if (!dateOfBirthLabel) {
            await this.navigator.logPage(this.basePathError, 'date_of_birth_label');
            throw new Error('Date of birth label not found');
        }

        const buttonUploadPhoto = await this.navigator.waitForSelectors([
            `::-p-xpath(//button[contains(., 'Upload photo')])`,
            `::-p-xpath(//button[contains(., 'Edit photo')])`,
        ]);
        if (!buttonUploadPhoto) {
            await this.navigator.logPage(this.basePathError, 'button_upload_photo');
            throw new Error('Button upload photo not found');
        }
        await buttonUploadPhoto.click({ delay: 500 });
        await this.navigator.sleep(1000);

        {
            const deletePhotoButton = await this.navigator.waitForSelectors([
                `::-p-xpath(//button[contains(., 'Delete current Image')])`,
                `::-p-xpath(//button[contains(., 'Delete')])`
            ]);
            if (deletePhotoButton) {
                await deletePhotoButton.click({ delay: 500 });
                await this.navigator.sleep(1000);
            }
        }

        {
            const fileInput = await this.navigator.waitForSelector(
                `::-p-xpath(//input[@type='file'])`
            );
            if (!fileInput) {
                await this.navigator.logPage(this.basePathError, 'file_input');
                throw new Error('File input not found');
            }
            await fileInput.uploadFile(photoPath);
            await this.navigator.sleep(1000);

            const buttonAttachPhoto = await this.navigator.waitForSelector(
                `::-p-xpath(//button[contains(., 'Attach photo')])`
            );
            if (!buttonAttachPhoto) {
                await this.navigator.logPage(this.basePathError, 'button_attach_photo');
                throw new Error('Button attach photo not found');
            }
            await buttonAttachPhoto.click({ delay: 500 });
            await this.navigator.sleep(10000);
        }

        {
            const dateOfBirthContainer = await this.navigator.waitForSelector(
                `::-p-xpath(//label[contains(., 'Date of Birth')]/parent::div)`
            );
            if (!dateOfBirthContainer) {
                await this.navigator.logPage(this.basePathError, 'date_of_birth_container');
                throw new Error('Date of birth container not found');
            }

            await this.navigator.highlightElement(dateOfBirthContainer);
            await dateOfBirthContainer.click({ delay: 500 });
            await this.navigator.sleep(1000);

            const dateOfBirthInput = await dateOfBirthContainer.$("::-p-xpath(.//input[@type='text'])");
            if (!dateOfBirthInput) {
                await this.navigator.logPage(this.basePathError, 'date_of_birth_input');
                throw new Error('Date of birth input not found');
            }
            await dateOfBirthInput.click({ delay: 500 });
            await dateOfBirthInput.type(account.date_of_birth, { delay: 100 });
            await dateOfBirthLabel.click({ delay: 500 });
            await this.navigator.sleep(1000);
        }

        {
            const countryContainer = await this.navigator.waitForSelector(
                `::-p-xpath(//label[contains(., 'Country')]/parent::div)`
            );
            const countryLabelInput = await this.navigator.waitForSelector(
                `::-p-xpath(//div[@aria-labelledby="country-label"])`
            );
            if (!countryContainer || !countryLabelInput) {
                await this.navigator.logPage(this.basePathError, 'country_label_input');
                throw new Error('Country label input not found');
            }
            await countryLabelInput.click({ delay: 500 });
            await this.navigator.sleep(1000);

            const countrySearchInput = await countryContainer.$("::-p-xpath(.//input[@type='search'])");
            if (!countrySearchInput) {
                await this.navigator.logPage(this.basePathError, 'country_search_input');
                throw new Error('Country search input not found');
            }
            await this.navigator.highlightElement(countrySearchInput);
            await countrySearchInput.click({ delay: 500 });
            await countrySearchInput.type(account.country, { delay: 100 });
            await this.navigator.sleep(1000);

            const countryOption = await countryContainer.$("::-p-xpath(.//li[@role='option'][1])");
            if (!countryOption) {
                await this.navigator.logPage(this.basePathError, 'country_option');
                throw new Error('Country option not found');
            }
            await this.navigator.highlightElement(countryOption);
            await countryOption.click({ delay: 500 });
            await this.navigator.sleep(3000);
        }

        {
            const searchAddressInput = await this.navigator.waitForSelectors([
                `::-p-xpath(//label[contains(., 'Street address')]/parent::div//input)`,
                `::-p-xpath(//div[@data-qa="input-address"]//input)`
            ]);
            if (!searchAddressInput) {
                await this.navigator.logPage(this.basePathError, 'search_address_input');
                throw new Error('Search address input not found');
            }
            await this.navigator.highlightElement(searchAddressInput);
            await searchAddressInput.click({ delay: 500 });
            await searchAddressInput.type(account.address, { delay: 100 });
            await this.navigator.sleep(1000);

            const searchAddressContainer = await this.navigator.waitForSelectors([
                `::-p-xpath(//label[contains(., 'Street address')]/parent::div)`,
                `::-p-xpath(//div[@data-qa="input-address"]/parent::div)`
            ]);
            if (!searchAddressContainer) {
                await this.navigator.logPage(this.basePathError, 'search_address_container');
                throw new Error('Search address container not found');
            }

            const searchAddressOption = await searchAddressContainer.$("::-p-xpath(.//li[@role='option'][1])");
            if (searchAddressOption) {
                await searchAddressOption.click({ delay: 500 });
            }

            await this.navigator.sleep(2000);
            await dateOfBirthLabel.click({ delay: 500 });
        }

        {
            const cityContainer = await this.navigator.waitForSelector(`
                ::-p-xpath(//label[contains(., 'City')]/parent::div)
            `);

            const clearInputButton = await cityContainer!.$("::-p-xpath(.//button[contains(.,'Clear Input')])");
            if (clearInputButton) {
                await this.navigator.highlightElement(clearInputButton);
                await clearInputButton.click({ delay: 500 });
                await this.navigator.sleep(1000);
            }

            const cityInput = await cityContainer!.$("::-p-xpath(.//input)");
            if (!cityInput) {
                await this.navigator.logPage(this.basePathError, 'city_input');
                throw new Error('City input not found');
            }
            await this.navigator.highlightElement(cityInput);
            await cityInput.click({ count: 3, delay: 100 });
            await this.navigator.page.keyboard.press('Backspace');
            await cityInput.type(account.city, { delay: 100 });
            await this.navigator.sleep(1000);

            const cityOption = await cityContainer!.$("::-p-xpath(.//li[@role='option'][1])");
            if (!cityOption) {
                await this.navigator.logPage(this.basePathError, 'city_option');
                throw new Error('City option not found');
            }
            await this.navigator.highlightElement(cityOption);
            await cityOption.click({ delay: 500 });
            await this.navigator.sleep(1000);
        }

        {
            const postalCodeContainer = await this.navigator.waitForSelector(`
                ::-p-xpath(//label[contains(., 'Postal code')]/parent::div)
            `);
            const clearInputButton = await postalCodeContainer!.$("::-p-xpath(.//button[contains(.,'Clear Input')])");
            if (clearInputButton) {
                await this.navigator.highlightElement(clearInputButton);
                await clearInputButton.click({ delay: 500 });
                await this.navigator.sleep(1000);
            }

            const postalCodeInput = await this.navigator.waitForSelector(`
                ::-p-xpath(//label[contains(., 'Postal code')]/parent::div//input)
            `);
            if (!postalCodeInput) {
                await this.navigator.logPage(this.basePathError, 'postal_code_input');
                throw new Error('Postal code input not found');
            }
            await postalCodeInput.click({ delay: 500 });
            await postalCodeInput.type(account.postal_code, { delay: 100 });
            await this.navigator.sleep(1000);
        }

        {
            const phoneNumberInput = await this.navigator.waitForSelector(`
                ::-p-xpath(//label[contains(., 'Phone')]/parent::div//input)
            `);
            if (!phoneNumberInput) {
                await this.navigator.logPage(this.basePathError, 'phone_number_input');
                throw new Error('Phone number input not found');
            }
            await phoneNumberInput.click({ delay: 500 });
            await phoneNumberInput.type(account.phone_number, { delay: 100 });
            await this.navigator.sleep(1000);
        }

        const buttonReview = await this.navigator.waitForSelector(`
            ::-p-xpath(//button[contains(., 'Review your profile')])
        `);
        if (!buttonReview) {
            await this.navigator.logPage(this.basePathError, 'button_review');
            throw new Error('Button review not found');
        }
        await buttonReview.click({ delay: 500 });
        await this.navigator.sleep(3000);
    }

    async submitProfile() {
        await this.navigator.moveMouseRandomly();

        const buttonSubmit = await this.navigator.waitForSelector(`
            ::-p-xpath(//button[contains(., 'Submit profile')])
        `);
        if (!buttonSubmit) {
            await this.navigator.logPage(this.basePathError, 'button_submit');
            throw new Error('Button submit not found');
        }
        await buttonSubmit.click({ delay: 500 });
        await this.navigator.sleep(7000);
    }
}

export default UpworkAutomationService