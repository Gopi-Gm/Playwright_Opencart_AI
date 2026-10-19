import { Page, Locator } from '@playwright/test';

export class HomePage {
    private readonly page: Page;

    // Locators
    private readonly lnkMyAccount: Locator;
    private readonly lnkLogin: Locator;
    private readonly lnkRegister: Locator;
    private readonly txtSearch: Locator;
    private readonly btnSearch: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lnkMyAccount = page.locator('a[title="My Account"]');
        this.lnkLogin = page.locator('a[href*="route=account/login"]').first();
        this.lnkRegister = page.locator('a[href*="route=account/register"]').first();
        this.txtSearch = page.getByPlaceholder('Search');
        this.btnSearch = page.locator('button.btn.btn-default.btn-lg');
    }

    /**
     * Clicks the My Account dropdown to reveal menu items
     */
    async clickMyAccount(): Promise<void> {
        await this.lnkMyAccount.click();
    }

    /**
     * Clicks the Login menu item in the My Account dropdown
     */
    async clickLogin(): Promise<void> {
        await this.lnkLogin.click();
    }

    /**
     * Clicks the Register menu item in the My Account dropdown
     */
    async clickRegister(): Promise<void> {
        await this.lnkRegister.click();
    }

    /**
     * Navigates directly to the shopping cart page
     */
    async navigateToCart(): Promise<void> {
        await this.page.goto(process.env.WEB_APP_URL + 'index.php?route=checkout/cart');
    }

    /**
     * Searches for a product by name
     * @param productName - The product name to search for
     */
    async searchProduct(productName: string): Promise<void> {
        await this.txtSearch.fill(productName);
        await this.btnSearch.click();
    }

    /**
     * Verifies the homepage is loaded
     * @returns Promise<boolean> - true if the homepage is displayed
     */
    async isHomePageExists(): Promise<boolean> {
        try {
            await this.lnkMyAccount.waitFor({ state: 'visible', timeout: 15000 });
            return await this.lnkMyAccount.isVisible();
        } catch (error) {
            console.log(`Error checking homepage: ${error}`);
            return false;
        }
    }

    /**
     * Verifies the Login link is visible in the My Account dropdown (confirms unauthenticated state)
     * @returns Promise<boolean> - true if the Login link is visible
     */
    async isLoginLinkVisible(): Promise<boolean> {
        try {
            await this.lnkLogin.waitFor({ state: 'visible', timeout: 10000 });
            return await this.lnkLogin.isVisible();
        } catch (error) {
            console.log(`Error checking login link: ${error}`);
            return false;
        }
    }
}
