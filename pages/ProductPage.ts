import { Page, Locator, expect } from '@playwright/test';

export class ProductPage {
    private readonly page: Page;

    // Locators
    private readonly headingProductName: Locator;
    private readonly txtQuantity: Locator;
    private readonly btnAddToCart: Locator;
    private readonly alertSuccess: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingProductName = page.locator('#content h1');
        this.txtQuantity = page.locator('#input-quantity');
        this.btnAddToCart = page.locator('#button-cart');
        this.alertSuccess = page.locator('.alert-success');
    }

    /**
     * Returns the product name displayed on the page
     * @returns Promise<string> - Product name text
     */
    async getProductName(): Promise<string> {
        return await this.headingProductName.innerText();
    }

    /**
     * Sets the quantity for the product
     * @param quantity - Quantity to set
     */
    async setQuantity(quantity: string): Promise<void> {
        await this.txtQuantity.clear();
        await this.txtQuantity.fill(quantity);
    }

    /**
     * Clicks the Add to Cart button
     */
    async clickAddToCart(): Promise<void> {
        await this.btnAddToCart.click();
    }

    /**
     * Returns the success alert message text after adding product to cart
     * @returns Promise<string> - Success message text
     */
    async getSuccessMessage(): Promise<string> {
        await this.alertSuccess.waitFor({ state: 'visible' });
        return await this.alertSuccess.innerText();
    }

    /**
     * Adds the product to cart with the specified quantity
     * @param quantity - Quantity to add (default: '1')
     */
    async addToCart(quantity: string = '1'): Promise<void> {
        await this.setQuantity(quantity);
        await expect(async () => {
            await this.clickAddToCart();
            await expect(this.alertSuccess).toBeVisible({ timeout: 4000 });
        }).toPass({ timeout: 20000 });
    }

    /**
     * Verifies the product details page is displayed
     * @returns Promise<boolean> - true if the product page is displayed
     */
    async isProductPageExists(): Promise<boolean> {
        try {
            await this.headingProductName.waitFor({ state: 'visible', timeout: 10000 });
            return await this.headingProductName.isVisible();
        } catch (error) {
            console.log(`Error checking product page: ${error}`);
            return false;
        }
    }
}
