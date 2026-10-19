import { Page, Locator } from '@playwright/test';

export class CartPage {
    private readonly page: Page;

    // Locators
    private readonly tblCart: Locator;
    private readonly productNameLinks: Locator;
    private readonly quantityInputs: Locator;
    private readonly productPrices: Locator;
    private readonly cartTotals: Locator;
    private readonly emptyCartMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors (confirmed via browser DOM inspection)
        this.tblCart = page.locator('div.table-responsive');
        this.productNameLinks = page.locator('div.table-responsive table.table-bordered tbody tr td:nth-child(2) a');
        this.quantityInputs = page.locator('div.table-responsive table.table-bordered tbody tr td:nth-child(4) input.form-control');
        this.productPrices = page.locator('div.table-responsive table.table-bordered tbody tr td:nth-child(5)');
        this.cartTotals = page.locator('.col-sm-4 table.table-bordered tr td strong');
        this.emptyCartMessage = page.getByText('Your shopping cart is empty!');
    }

    /**
     * Returns the name of the first product in the cart
     * @returns Promise<string> - Product name text
     */
    async getFirstProductName(): Promise<string> {
        return await this.productNameLinks.first().innerText();
    }

    /**
     * Returns the quantity of the first product in the cart
     * @returns Promise<string> - Quantity value
     */
    async getFirstProductQuantity(): Promise<string> {
        return await this.quantityInputs.first().inputValue();
    }

    /**
     * Returns the price of the first product in the cart
     * @returns Promise<string> - Price text
     */
    async getFirstProductPrice(): Promise<string> {
        return await this.productPrices.first().innerText();
    }

    /**
     * Returns the cart total (last total row value)
     * @returns Promise<string> - Total price text
     */
    async getCartTotal(): Promise<string> {
        const count = await this.cartTotals.count();
        return await this.cartTotals.nth(count - 1).innerText();
    }

    /**
     * Verifies the cart page contains products (not empty)
     * @returns Promise<boolean> - true if the cart has at least one product
     */
    async isCartPageExists(): Promise<boolean> {
        try {
            await this.productNameLinks.first().waitFor({ state: 'visible', timeout: 10000 });
            return await this.productNameLinks.first().isVisible();
        } catch (error) {
            console.log(`Error checking cart page: ${error}`);
            return false;
        }
    }

    /**
     * Checks if a specific product is present in the cart by name
     * @param productName - Product name to search for in the cart
     * @returns Promise<boolean> - true if the product is found in the cart
     */
    async isProductInCart(productName: string): Promise<boolean> {
        try {
            const count = await this.productNameLinks.count();
            for (let i = 0; i < count; i++) {
                const name = await this.productNameLinks.nth(i).innerText();
                if (name.toLowerCase().includes(productName.toLowerCase())) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.log(`Error checking product in cart: ${error}`);
            return false;
        }
    }
}
