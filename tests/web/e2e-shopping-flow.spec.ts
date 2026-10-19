/**
 * Test Case: End-to-End Shopping Flow
 *
 * Tags: @master @sanity @regression @web @end-to-end @e2e
 *
 * Steps:
 * 1) Open the application and register a new customer with dynamically generated unique data
 * 2) Verify successful registration
 * 3) Log out
 * 4) Log in using the newly created credentials
 * 5) Verify successful authentication
 * 6) Search for a known product
 * 7) Open the product details page and add to cart
 * 8) Navigate to shopping cart and verify product, quantity, price, and total
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';

test('End-to-End Shopping Flow @master @sanity @regression @web @end-to-end @e2e', async ({
    homePage,
    registerPage,
    accountCreatedPage,
    loginPage,
    myAccountPage,
    logoutPage,
    searchResultsPage,
    productPage,
    cartPage,
}) => {
    test.slow();
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = RandomDataUtil.getEmail();
    const telephone = RandomDataUtil.getPhoneNumber();
    const password = RandomDataUtil.getPassword(10);
    const { productName, productQuantity, totalPrice } = Helper.getProductDetails();

    // ─── Step 1: Register new customer ───────────────────────────────────────
    await test.step('1) Register a new customer with dynamically generated data', async () => {
        await homePage.clickMyAccount();
        await homePage.clickRegister();
        await registerPage.completeRegistration({
            firstName,
            lastName,
            email,
            telephone,
            password,
        });
    });

    await test.step('2) Verify successful registration', async () => {
        const isAccountCreated = await accountCreatedPage.isAccountCreatedPageExists();
        expect(isAccountCreated).toBeTruthy();
    });

    // ─── Step 2: Log out ─────────────────────────────────────────────────────
    await test.step('3) Log out after registration', async () => {
        await myAccountPage.clickLogout();
        const isLogoutPage = await logoutPage.isLogoutPageExists();
        expect(isLogoutPage).toBeTruthy();
        await logoutPage.clickContinue();
    });

    // ─── Step 3: Log in again ─────────────────────────────────────────────────
    await test.step('4) Log in again using the newly created credentials', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
        await loginPage.login(email, password);
    });

    await test.step('5) Verify successful authentication', async () => {
        const isMyAccountPage = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountPage).toBeTruthy();
    });

    // ─── Step 4: Search and add product to cart ───────────────────────────────
    await test.step('6) Search for the known product', async () => {
        await homePage.searchProduct(productName);
        const hasResults = await searchResultsPage.hasResults();
        expect(hasResults).toBeTruthy();
    });

    await test.step('7) Open the product details page and add to cart', async () => {
        await searchResultsPage.clickProduct(productName);
        const isProductPage = await productPage.isProductPageExists();
        expect(isProductPage).toBeTruthy();
        await productPage.addToCart(productQuantity);
        const successMessage = await productPage.getSuccessMessage();
        expect(successMessage).toContain('Success');
    });

    // ─── Step 5: Validate cart ────────────────────────────────────────────────
    await test.step('8) Navigate to cart and verify product, quantity, price, and total', async () => {
        await homePage.navigateToCart();

        const isCartPage = await cartPage.isCartPageExists();
        expect(isCartPage).toBeTruthy();

        const inCart = await cartPage.isProductInCart(productName);
        expect(inCart).toBeTruthy();

        const quantity = await cartPage.getFirstProductQuantity();
        expect(quantity).toBe(productQuantity);

        const productPrice = await cartPage.getFirstProductPrice();
        expect(productPrice).toBeTruthy();

        const cartTotal = await cartPage.getCartTotal();
        expect(cartTotal).toBeTruthy();
    });

    console.log('✅ ✔️ End-to-End Shopping Flow completed successfully!');
});
