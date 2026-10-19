/**
 * Test Case: Logout Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Navigate to the application and log in with valid credentials
 * 2) Verify successful authentication
 * 3) Navigate to the logout option and click Logout
 * 4) Verify the logout confirmation page is displayed
 * 5) Click Continue and verify redirect to homepage
 * 6) Verify authenticated options are no longer visible
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Logout Flow @master @sanity @regression @web', async ({
    homePage,
    loginPage,
    myAccountPage,
    logoutPage,
}) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Navigate to My Account → Login and log in', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
        await loginPage.login(email, password);
    });

    await test.step('2) Verify successful authentication', async () => {
        const isMyAccountPage = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountPage).toBeTruthy();
    });

    await test.step('3) Navigate to logout and click Logout', async () => {
        await myAccountPage.clickLogout();
    });

    await test.step('4) Verify the logout confirmation page is displayed', async () => {
        const isLogoutPage = await logoutPage.isLogoutPageExists();
        expect(isLogoutPage).toBeTruthy();
    });

    await test.step('5) Click Continue and verify redirect to homepage', async () => {
        await logoutPage.clickContinue();
        const isHomePage = await homePage.isHomePageExists();
        expect(isHomePage).toBeTruthy();
    });

    await test.step('6) Verify authenticated account options are no longer available', async () => {
        await homePage.clickMyAccount();
        // After logout, the Login link should be visible in the My Account dropdown
        const loginLinkVisible = await homePage.isLoginLinkVisible();
        expect(loginLinkVisible).toBeTruthy();
    });

    console.log('✅ ✔️ Logout Flow completed successfully!');
});
