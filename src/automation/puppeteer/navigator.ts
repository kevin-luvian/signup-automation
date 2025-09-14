import { Browser, Page, ElementHandle } from "puppeteer";
import puppeteer from "puppeteer-extra";
import path from 'path';
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import fs from 'fs';
import { format } from 'date-fns';

const SCRAPE_OPS_API_KEY = process.env.SCRAPE_OPS_API_KEY;

interface PuppeteerNavigatorOptions {
    headless?: boolean;
    useStealth?: boolean;
}

class PuppeteerNavigator {
    public browser: Browser;
    public page: Page;
    private highlightedElement: ElementHandle | null = null;

    constructor(browser: Browser, page: Page) {
        this.browser = browser;
        this.page = page;
    }

    static async create(opts: PuppeteerNavigatorOptions = {}) {
        if (opts.useStealth ?? true) {
            puppeteer.use(StealthPlugin())
        }
        const launchArgs = [
            '--start-fullscreen',
            '--start-maximized',
        ];
        // launchArgs.push('--proxy-server=http://residential-proxy.scrapeops.io:8181');
        // Set up proxy authentication
        // await page.authenticate({
        //     username: 'scrapeops.sticky_session=10000',
        //     password: SCRAPE_OPS_API_KEY!,
        // });

        const browser = await puppeteer.launch({
            headless: opts.headless ?? false,
            devtools: false,
            args: launchArgs,
        });
        const page = (await browser.pages())[0];

        return new PuppeteerNavigator(browser, page);
    }

    async close(): Promise<void> {
        await this.browser.close();
    }

    async ignoreImages(): Promise<void> {
        await this.page.setRequestInterception(true);
        this.page.on('request', (request) => {
            if (request.resourceType() === 'image') {
                request.abort();
            } else {
                request.continue();
            }
        });
    }

    async moveMouseRandomly(times: number = 3, delay: number = 300) {
        const viewport = this.page.viewport() || { width: 1280, height: 800 };
        for (let i = 0; i < times; i++) {
            // Pick a random area within the screen for this move
            const areaWidth = Math.floor(Math.random() * (viewport.width / 2)) + 100;
            const areaHeight = Math.floor(Math.random() * (viewport.height / 2)) + 100;
            const minX = Math.floor(Math.random() * (viewport.width - areaWidth));
            const minY = Math.floor(Math.random() * (viewport.height - areaHeight));
            const maxX = minX + areaWidth;
            const maxY = minY + areaHeight;

            const x = Math.floor(Math.random() * (maxX - minX)) + minX;
            const y = Math.floor(Math.random() * (maxY - minY)) + minY;
            await this.page.mouse.move(x, y, { steps: 5 });
            await this.sleep(delay);
        }
    }

    async changePage(url: string, timeout: number = 60000): Promise<void> {
        await this.page.goto(url, { waitUntil: 'load', timeout });
    }

    async randomSleep(fromMs: number, toMs: number): Promise<void> {
        const ms = Math.floor(Math.random() * (toMs - fromMs + 1)) + fromMs;
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async setUserAgent(userAgent: string): Promise<void> {
        await this.page.setUserAgent(userAgent);
    }

    async locateById(id: string) {
        try {
            const element = await this.page.waitForSelector(`[id="${id}"]`, { timeout: 1000, visible: true });
            return element;
        } catch (error) {
            return null;
        }
    }

    async waitForSelectors(selectors: string[]) {
        for (const selector of selectors) {
            try {
                const element = await this.page.waitForSelector(selector, {
                    timeout: 1000,
                    visible: true,
                });
                if (element) {
                    await this.highlightElement(element);
                    return element;
                }
            } catch {
                continue;
            }
        }
        return null;
    }

    async waitForSelector(selector: string, timeout: number = 1000) {
        try {
            const element = await this.page.waitForSelector(selector, {
                visible: true,
                timeout,
            });
            if (element) {
                await this.highlightElement(element);
            }

            return element;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getAriaLabelledby(selector: string) {
        try {
            const element = await this.waitForSelector(selector);
            const labelId = await element!.evaluate(el => el.id);
            return this.waitForSelector(`[aria-labelledby="${labelId}"]`);
        } catch {
            return null;
        }
    }

    async highlightElement(element: ElementHandle) {
        if (this.highlightedElement) {
            try {
                await this.highlightedElement.evaluate((el) => {
                    if (el.originalStyle !== undefined) {
                        el.style.cssText = el.originalStyle;
                    }
                });
            } catch {
                console.warn('Previous highlighted element is no longer valid');
            }
        }

        await element.evaluate((el) => {
            el.originalStyle = el.style.cssText;
            el.style.border = '2px solid green';
            el.style.transition = 'border 0.5s ease-in-out';
            el.style.boxShadow = '0 0 10px green';
        });

        this.highlightedElement = element;
    }

    async logPage(basePath: string, label: string): Promise<void> {
        const timestamp = format(new Date(), 'yyyyMMdd_HHmmss_');
        const filePath = path.join(basePath, `${timestamp}${label}`);
        await this.page.screenshot({ path: `${filePath}.png`, fullPage: true });

        const htmlContent = await this.page.content();
        fs.writeFileSync(`${filePath}.html`, htmlContent, 'utf-8');
    }
}

export default PuppeteerNavigator;
