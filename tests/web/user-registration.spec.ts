/**
 * Test Case: User Registration Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Navigate to the application and open My Account → Register
 * 2) Verify the registration page is displayed
 * 3) Fill in valid registration details with dynamically generated email
 * 4) Accept Privacy Policy and submit the form
 * 5) Verify account created confirmation message
 * 6) Verify account navigation is available
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('User Registration Flow @master @sanity @regression @web', async ({
    homePage,
    registerPage,
    accountCreatedPage,
    myAccountPage,
}) => {
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = RandomDataUtil.getEmail();
    const telephone = RandomDataUtil.getPhoneNumber();
    const password = RandomDataUtil.getPassword(10);

    await test.step('1) Navigate to My Account → Register', async () => {
        await homePage.clickMyAccount();
        await homePage.clickRegister();
    });

    await test.step('2) Verify the registration page is displayed', async () => {
        const isRegisterPage = await registerPage.isRegisterPageExists();
        expect(isRegisterPage).toBeTruthy();
    });

    await test.step('3) Fill in the registration form with valid data', async () => {
        await registerPage.completeRegistration({
            firstName,
            lastName,
            email,
            telephone,
            password,
        });
    });

    await test.step('4) Verify registration success - Account Created page', async () => {
        const isAccountCreated = await accountCreatedPage.isAccountCreatedPageExists();
        expect(isAccountCreated).toBeTruthy();
        const headingText = await accountCreatedPage.getHeadingText();
        expect(headingText).toContain('Your Account Has Been Created!');
    });

    await test.step('5) Click Continue and verify account navigation is available', async () => {
        await accountCreatedPage.clickContinue();
        const isMyAccountPage = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountPage).toBeTruthy();
    });

    console.log('✅ ✔️ User Registration Flow completed successfully!');
});
