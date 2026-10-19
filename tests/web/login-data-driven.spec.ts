/**
 * Test Case: Login Flow – Data Driven using External File
 *
 * Tags: @master @regression @datadriven @web
 *
 * Steps:
 * For each row in the external test data file:
 * 1) Open the OpenCart login page
 * 2) Enter the email and password (leave blank fields empty)
 * 3) Submit the login form
 * 4) Validate based on the 'expected' column:
 *    - 'success' → verify My Account page is displayed
 *    - 'failure' → verify the warning message is displayed
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { DataProvider } from '../../utils/DataReader';
import path from 'path';

// ─── Load test data from external JSON file ──────────────────────────────────
const loginDataPath = path.resolve('testdata/opencart_logindata.json');
const loginData: Array<{
    testName: string;
    email: string;
    password: string;
    expected: string;
}> = DataProvider.readJson(loginDataPath);

// ─── Generate one independent test per data row ───────────────────────────────
loginData.forEach((row, index) => {
    test(`Login Data-Driven [${index + 1}]: ${row.testName} (${row.expected}) @master @regression @datadriven @web`, async ({
        homePage,
        loginPage,
        myAccountPage,
    }) => {

        await test.step('1) Navigate to My Account → Login', async () => {
            await homePage.clickMyAccount();
            await homePage.clickLogin();
        });

        await test.step('2) Enter credentials and submit', async () => {
            const email = row.email.trim() === '' ? '' : row.email;
            const password = row.password.trim() === '' ? '' : row.password;
            await loginPage.login(email, password);
        });

        if (row.expected === 'success') {
            await test.step('3) Verify successful login - My Account page is displayed', async () => {
                const isMyAccountPage = await myAccountPage.isMyAccountPageExists();
                expect(isMyAccountPage).toBeTruthy();
            });
        } else {
            await test.step('3) Verify login failure - warning message is displayed', async () => {
                const alertMessage = await loginPage.getAlertMessage();
                expect(
                    alertMessage.includes('Warning: No match for E-Mail Address and/or Password.') ||
                    alertMessage.includes('Warning: Your account has exceeded allowed number of login attempts.')
                ).toBeTruthy();
            });
        }

        console.log(`✅ ✔️ Data-Driven Login: '${row.testName}' (${row.expected}) completed successfully!`);
    });
});
