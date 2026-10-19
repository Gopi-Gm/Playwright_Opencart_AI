/**
 * Test Case: Valid Login Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Navigate to the application and open My Account → Login
 * 2) Verify the login page is displayed
 * 3) Enter valid credentials from the configured test data
 * 4) Submit the login form
 * 5) Verify successful authentication and redirection to My Account
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Valid Login Flow @master @sanity @regression @web', async ({
    homePage,
    loginPage,
    myAccountPage,
}) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Navigate to My Account → Login', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
    });

    await test.step('2) Verify the login page is displayed', async () => {
        const isLoginPage = await loginPage.isLoginPageExists();
        expect(isLoginPage).toBeTruthy();
    });

    await test.step('3) Enter valid credentials and submit', async () => {
        await loginPage.login(email, password);
    });

    await test.step('4) Verify successful authentication and My Account page', async () => {
        const isMyAccountPage = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountPage).toBeTruthy();
        const headingText = await myAccountPage.getHeadingText();
        expect(headingText).toContain('My Account');
    });

    console.log('✅ ✔️ Valid Login Flow completed successfully!');
});
