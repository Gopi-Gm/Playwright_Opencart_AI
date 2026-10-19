import { Page, Locator } from '@playwright/test';

export class RegisterPage {
    private readonly page: Page;

    // Locators
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtEmail: Locator;
    private readonly txtTelephone: Locator;
    private readonly txtPassword: Locator;
    private readonly txtPasswordConfirm: Locator;
    private readonly chkPrivacyPolicy: Locator;
    private readonly btnContinue: Locator;
    private readonly headingRegister: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtFirstName = page.locator('#input-firstname');
        this.txtLastName = page.locator('#input-lastname');
        this.txtEmail = page.locator('#input-email');
        this.txtTelephone = page.locator('#input-telephone');
        this.txtPassword = page.locator('#input-password');
        this.txtPasswordConfirm = page.locator('#input-confirm');
        this.chkPrivacyPolicy = page.locator('input[name="agree"]');
        this.btnContinue = page.locator('input.btn.btn-primary[value="Continue"]');
        this.headingRegister = page.locator('#content h1');
    }

    /**
     * Fills in the First Name field
     * @param firstName - First name to enter
     */
    async setFirstName(firstName: string): Promise<void> {
        await this.txtFirstName.fill(firstName);
    }

    /**
     * Fills in the Last Name field
     * @param lastName - Last name to enter
     */
    async setLastName(lastName: string): Promise<void> {
        await this.txtLastName.fill(lastName);
    }

    /**
     * Fills in the Email field
     * @param email - Email to enter
     */
    async setEmail(email: string): Promise<void> {
        await this.txtEmail.fill(email);
    }

    /**
     * Fills in the Telephone field
     * @param telephone - Phone number to enter
     */
    async setTelephone(telephone: string): Promise<void> {
        await this.txtTelephone.fill(telephone);
    }

    /**
     * Fills in the Password field
     * @param password - Password to enter
     */
    async setPassword(password: string): Promise<void> {
        await this.txtPassword.fill(password);
    }

    /**
     * Fills in the Password Confirm field
     * @param password - Confirm password to enter
     */
    async setPasswordConfirm(password: string): Promise<void> {
        await this.txtPasswordConfirm.fill(password);
    }

    /**
     * Checks the Privacy Policy checkbox
     */
    async acceptPrivacyPolicy(): Promise<void> {
        await this.chkPrivacyPolicy.check();
    }

    /**
     * Clicks the Continue/Submit button
     */
    async clickContinue(): Promise<void> {
        await this.btnContinue.click();
    }

    /**
     * Completes the full registration form with the provided data
     * @param userData - Object containing all registration data
     */
    async completeRegistration(userData: {
        firstName: string;
        lastName: string;
        email: string;
        telephone: string;
        password: string;
    }): Promise<void> {
        try {
            await this.setFirstName(userData.firstName);
            await this.setLastName(userData.lastName);
            await this.setEmail(userData.email);
            await this.setTelephone(userData.telephone);
            await this.setPassword(userData.password);
            await this.setPasswordConfirm(userData.password);
            await this.acceptPrivacyPolicy();
            await this.clickContinue();
        } catch (error) {
            console.log(`Error during registration: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies the registration page is displayed
     * @returns Promise<boolean> - true if the register page is displayed
     */
    async isRegisterPageExists(): Promise<boolean> {
        try {
            await this.headingRegister.waitFor({ state: 'visible', timeout: 10000 });
            return await this.headingRegister.isVisible();
        } catch (error) {
            console.log(`Error checking register page: ${error}`);
            return false;
        }
    }
}
