import { Page, Locator } from '@playwright/test';

export class SearchResultsPage {
    private readonly page: Page;

    // Locators
    private readonly productLayout: Locator;
    private readonly productTitleLinks: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.productLayout = page.locator('.product-layout');
        this.productTitleLinks = page.locator('.product-thumb h4 a');
    }

    /**
     * Returns the count of products shown in the search results
     * @returns Promise<number> - Number of products in results
     */
    async getResultsCount(): Promise<number> {
        return await this.productLayout.count();
    }

    /**
     * Returns true if at least one product result is displayed
     * @returns Promise<boolean> - true if results exist
     */
    async hasResults(): Promise<boolean> {
        try {
            await this.productLayout.first().waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch (error) {
            console.log(`Error checking results: ${error}`);
            return false;
        }
    }

    /**
     * Returns an array of all product title texts from search results
     * @returns Promise<string[]> - Array of product titles
     */
    async getAllProductTitles(): Promise<string[]> {
        await this.productTitleLinks.first().waitFor({ state: 'visible', timeout: 10000 });
        const count = await this.productTitleLinks.count();
        const titles: string[] = [];
        for (let i = 0; i < count; i++) {
            titles.push(await this.productTitleLinks.nth(i).innerText());
        }
        return titles;
    }

    /**
     * Clicks on the first product that matches the given name
     * @param productName - Product name to find and click
     */
    async clickProduct(productName: string): Promise<void> {
        const product = this.page.locator('.product-thumb h4 a', { hasText: productName }).first();
        await product.waitFor({ state: 'visible', timeout: 10000 });
        await product.click();
    }

    /**
     * Verifies the search results page is displayed with results
     * @returns Promise<boolean> - true if the page is displayed
     */
    async isSearchResultsPageExists(): Promise<boolean> {
        try {
            await this.productLayout.first().waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch (error) {
            console.log(`Error checking search results page: ${error}`);
            return false;
        }
    }
}
