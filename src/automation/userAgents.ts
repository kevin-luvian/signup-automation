export const UserAgents = {
    // Chrome on Windows
    CHROME_WINDOWS: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',

    // Chrome on macOS
    CHROME_MACOS: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',

    // Chrome on Linux
    CHROME_LINUX: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',

    // Firefox on Windows
    FIREFOX_WINDOWS: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',

    // Firefox on macOS
    FIREFOX_MACOS: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',

    // Firefox on Linux
    FIREFOX_LINUX: 'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0',

    // Safari on macOS
    SAFARI_MACOS: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',

    // Edge on Windows
    EDGE_WINDOWS: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',

    // Mobile Chrome on Android
    CHROME_ANDROID: 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',

    // Mobile Safari on iOS
    SAFARI_IOS: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',

    // Random mobile user agent
    MOBILE_RANDOM: 'Mozilla/5.0 (Linux; Android 11; SM-A515F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
} as const;

export type UserAgentType = keyof typeof UserAgents;

export function getRandomDesktopUserAgent(): string {
    const desktopUserAgents = [
        UserAgents.CHROME_WINDOWS,
        UserAgents.CHROME_MACOS,
        UserAgents.CHROME_LINUX,
        UserAgents.FIREFOX_WINDOWS,
        UserAgents.FIREFOX_MACOS,
        UserAgents.FIREFOX_LINUX,
        UserAgents.SAFARI_MACOS,
        UserAgents.EDGE_WINDOWS
    ];
    const randomIndex = Math.floor(Math.random() * desktopUserAgents.length);
    return desktopUserAgents[randomIndex];
}

export function getRandomMobileUserAgent(): string {
    const mobileUserAgents = [
        UserAgents.CHROME_ANDROID,
        UserAgents.SAFARI_IOS,
        UserAgents.MOBILE_RANDOM
    ];
    const randomIndex = Math.floor(Math.random() * mobileUserAgents.length);
    return mobileUserAgents[randomIndex];
}

