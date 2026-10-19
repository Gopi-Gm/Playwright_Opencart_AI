import { Page, Locator } from '@playwright/test';

export class AccountCreatedPage {
    private readonly page: Page;

    // Locators
    private readonly headingAccountCreated: Locator;
    private readonly btnContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingAccountCreated = page.locator('#content h1', { hasText: 'Your Account Has Been Created!' });
        this.btnContinue = page.locator('#content a.btn.btn-primary');
    }

    /**
     * Verifies the Account Created confirmation page is displayed
     * @returns Promise<boolean> - true if the confirmation page is displayed
     */
    async isAccountCreatedPageExists(): Promise<boolean> {
        try {
            await this.headingAccountCreated.waitFor({ state: 'visible', timeout: 15000 });
            return await this.headingAccountCreated.isVisible();
        } catch (error) {
            console.log(`Error checking account created page: ${error}`);
            return false;
        }
    }

    /**
     * Returns the heading text of the confirmation page
     * @returns Promise<string> - Heading text
     */
    async getHeadingText(): Promise<string> {
        await this.headingAccountCreated.waitFor({ state: 'visible', timeout: 15000 });
        return await this.headingAccountCreated.innerText();
    }

    /**
     * Clicks the Continue button after account creation
     */
    async clickContinue(): Promise<void> {
        await this.btnContinue.click();
    }
}
