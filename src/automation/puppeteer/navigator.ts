import { Browser, Page, ElementHandle } from "puppeteer";
import puppeteer from "puppeteer-extra";
import path from 'path';
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import fs from 'fs';
import { format } from 'date-fns';

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
        const browser = await puppeteer.launch({
            headless: opts.headless ?? false,
            args: ['--start-fullscreen', '--start-maximized'],
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
            el.style.border = '2px solid red';
            el.style.transition = 'border 0.5s ease-in-out';
            el.style.boxShadow = '0 0 10px red';
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
