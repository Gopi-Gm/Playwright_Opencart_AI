/**
 * Test Case: Add Product to Cart
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Navigate to the application
 * 2) Search for a known product
 * 3) Open the product details page
 * 4) Verify product details are displayed
 * 5) Set the desired quantity and click Add to Cart
 * 6) Verify the success confirmation message
 * 7) Open the shopping cart and verify the product is present
 * 8) Verify the quantity matches the requested quantity
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Add Product to Cart @master @sanity @regression @web', async ({
    homePage,
    searchResultsPage,
    productPage,
    cartPage,
}) => {
    const { productName, productQuantity } = Helper.getProductDetails();

    await test.step('1) Search for the known product', async () => {
        await homePage.searchProduct(productName);
    });

    await test.step('2) Open the product details page', async () => {
        await searchResultsPage.clickProduct(productName);
    });

    await test.step('3) Verify product details are displayed', async () => {
        const isProductPage = await productPage.isProductPageExists();
        expect(isProductPage).toBeTruthy();
        const displayedName = await productPage.getProductName();
        expect(displayedName.toLowerCase()).toContain(productName.toLowerCase());
    });

    await test.step('4) Set quantity and click Add to Cart', async () => {
        await productPage.addToCart(productQuantity);
    });

    await test.step('5) Verify product-added success message', async () => {
        const successMessage = await productPage.getSuccessMessage();
        expect(successMessage).toContain('Success');
    });

    await test.step('6) Navigate to shopping cart and verify product', async () => {
        await homePage.navigateToCart();
        const isCartPage = await cartPage.isCartPageExists();
        expect(isCartPage).toBeTruthy();
    });

    await test.step('7) Verify the product and quantity in the cart', async () => {
        const inCart = await cartPage.isProductInCart(productName);
        expect(inCart).toBeTruthy();
        const quantity = await cartPage.getFirstProductQuantity();
        expect(quantity).toBe(productQuantity);
    });

    console.log('✅ ✔️ Add Product to Cart completed successfully!');
});
