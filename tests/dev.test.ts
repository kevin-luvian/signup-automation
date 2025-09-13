import PuppeteerNavigator from '@src/automation/puppeteer/navigator';
import path from 'path';
import fs from 'fs';

describe('HTML File Reading Tests', () => {
    let navigator: PuppeteerNavigator;
    const testHtmlPath = path.join(__dirname, 'artifacts/education_history_modal.html');

    beforeAll(async () => {
        navigator = await PuppeteerNavigator.create({
            headless: true,
            useStealth: false,
        });
    });

    afterAll(async () => {
        if (navigator) {
            await navigator.close();
        }
    });

    test('should find specific text content in test.html', async () => {
        const fileUrl = `file://${testHtmlPath}`;
        await navigator.changePage(fileUrl);
        await navigator.sleep(1000);

        // Test for specific text content
        const pageContent = await navigator.page.content();

        const dateAttendedFromContainer = await navigator.waitForSelector(
            "::-p-xpath(//div[@data-qa='year-from'])"
        );
        expect(dateAttendedFromContainer).not.toBeNull()

        const searchInput = await dateAttendedFromContainer!.$("::-p-xpath(//input[@type='search'])");
        expect(searchInput).not.toBeNull()

        await searchInput!.focus();
        await searchInput!.click({ delay: 100 })
        await searchInput!.type('2025', { delay: 100 });

        const option = await dateAttendedFromContainer!.$("::-p-xpath(//li[contains(., '2025')])");
        expect(option).not.toBeNull()
        await option!.click({ delay: 100 });
    });
});
