import { Page, Locator } from '@playwright/test';

export class LogoutPage {
    private readonly page: Page;

    // Locators
    private readonly headingAccountLogout: Locator;
    private readonly btnContinue: Locator;
    private readonly logoutConfirmationText: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingAccountLogout = page.locator('#content h1');
        this.btnContinue = page.locator('#content a.btn.btn-primary');
        this.logoutConfirmationText = page.locator('#content p').first();
    }

    /**
     * Clicks the Continue button on the logout confirmation page
     */
    async clickContinue(): Promise<void> {
        await this.btnContinue.click();
    }

    /**
     * Verifies the logout confirmation page is displayed
     * @returns Promise<boolean> - true if the logout page is displayed
     */
    async isLogoutPageExists(): Promise<boolean> {
        try {
            await this.headingAccountLogout.waitFor({ state: 'visible', timeout: 10000 });
            return await this.headingAccountLogout.isVisible();
        } catch (error) {
            console.log(`Error checking logout page: ${error}`);
            return false;
        }
    }

    /**
     * Returns the logout confirmation text
     * @returns Promise<string> - Confirmation text
     */
    async getLogoutConfirmationText(): Promise<string> {
        return await this.logoutConfirmationText.innerText();
    }
}
