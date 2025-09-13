import PuppeteerNavigator from '@src/automation/puppeteer/navigator';

describe('Page Loading Tests', () => {
    let navigator: PuppeteerNavigator;

    beforeAll(async () => {
        navigator = await PuppeteerNavigator.create({
            headless: true,
        });
    });

    afterAll(async () => {
        if (navigator) {
            await navigator.close();
        }
    });

    test('should successfully load a page', async () => {
        await expect(async () => {
            await navigator.changePage('https://httpbin.org/get');
            await navigator.ignoreImages();
            await navigator.sleep(500);
        }).resolves.not.toThrow();
    });
});
