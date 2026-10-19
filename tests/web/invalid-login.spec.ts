/**
 * Test Case: Invalid Login Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Navigate to the application and open My Account → Login
 * 2) Enter invalid email and password credentials
 * 3) Submit the login form
 * 4) Verify authentication fails with the appropriate warning message
 * 5) Verify the user is not authenticated (still on login page)
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('Invalid Login Flow @master @sanity @regression @web', async ({
    homePage,
    loginPage,
}) => {
    const invalidEmail = RandomDataUtil.getEmail();
    const invalidPassword = RandomDataUtil.getPassword(8);

    await test.step('1) Navigate to My Account → Login', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
    });

    await test.step('2) Verify the login page is displayed', async () => {
        const isLoginPage = await loginPage.isLoginPageExists();
        expect(isLoginPage).toBeTruthy();
    });

    await test.step('3) Enter invalid credentials and submit', async () => {
        await loginPage.login(invalidEmail, invalidPassword);
    });

    await test.step('4) Verify authentication fails with warning message', async () => {
        const alertMessage = await loginPage.getAlertMessage();
        expect(
            alertMessage.includes('Warning: No match for E-Mail Address and/or Password.') ||
            alertMessage.includes('Warning: Your account has exceeded allowed number of login attempts.')
        ).toBeTruthy();
    });

    await test.step('5) Verify user is still on the login page (not authenticated)', async () => {
        const isLoginPage = await loginPage.isLoginPageExists();
        expect(isLoginPage).toBeTruthy();
    });

    console.log('✅ ✔️ Invalid Login Flow completed successfully!');
});
