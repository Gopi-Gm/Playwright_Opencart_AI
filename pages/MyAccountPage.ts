import { Page, Locator } from '@playwright/test';

export class MyAccountPage {
    private readonly page: Page;

    // Locators
    private readonly headingMyAccount: Locator;
    private readonly lnkLogout: Locator;
    private readonly lnkMyAccountNav: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingMyAccount = page.locator('#content').getByRole('heading', { name: 'My Account' });
        this.lnkLogout = page.locator('a[href*="route=account/logout"]').first();
        this.lnkMyAccountNav = page.locator('a[title="My Account"]');
    }

    /**
     * Clicks the Logout link (opens My Account dropdown first, then clicks Logout)
     */
    async clickLogout(): Promise<void> {
        await this.lnkMyAccountNav.click();
        await this.lnkLogout.waitFor({ state: 'visible', timeout: 5000 });
        await this.lnkLogout.click();
    }

    /**
     * Verifies the My Account page is displayed after login
     * @returns Promise<boolean> - true if the My Account page is displayed
     */
    async isMyAccountPageExists(): Promise<boolean> {
        try {
            await this.headingMyAccount.waitFor({ state: 'visible', timeout: 15000 });
            return await this.headingMyAccount.isVisible();
        } catch (error) {
            console.log(`Error checking My Account page: ${error}`);
            return false;
        }
    }

    /**
     * Returns the My Account page heading text
     * @returns Promise<string> - Heading text
     */
    async getHeadingText(): Promise<string> {
        return await this.headingMyAccount.innerText();
    }
}
