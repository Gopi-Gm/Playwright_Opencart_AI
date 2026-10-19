import { Page, Locator } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly txtEmail: Locator;
    private readonly txtPassword: Locator;
    private readonly btnLogin: Locator;
    private readonly alertDanger: Locator;
    private readonly headingAccountLogin: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtEmail = page.locator('#input-email');
        this.txtPassword = page.locator('#input-password');
        this.btnLogin = page.locator('input.btn.btn-primary[value="Login"]');
        this.alertDanger = page.locator('.alert-danger');
        this.headingAccountLogin = page.getByRole('heading', { name: 'Returning Customer' });
    }

    /**
     * Enters the email address
     * @param email - Email to enter
     */
    async setEmail(email: string): Promise<void> {
        await this.txtEmail.fill(email);
    }

    /**
     * Enters the password
     * @param password - Password to enter
     */
    async setPassword(password: string): Promise<void> {
        await this.txtPassword.fill(password);
    }

    /**
     * Clicks the Login button
     */
    async clickLoginButton(): Promise<void> {
        await this.btnLogin.click();
    }

    /**
     * Performs a full login with email and password
     * @param email - Email address
     * @param password - Password
     */
    async login(email: string, password: string): Promise<void> {
        try {
            await this.setEmail(email);
            await this.setPassword(password);
            await this.clickLoginButton();
        } catch (error) {
            console.log(`Error during login: ${error}`);
            throw error;
        }
    }

    /**
     * Returns the warning/error message text displayed after failed login
     * @returns Promise<string> - The error message text
     */
    async getAlertMessage(): Promise<string> {
        await this.alertDanger.waitFor({ state: 'visible' });
        return await this.alertDanger.innerText();
    }

    /**
     * Verifies the login page is displayed
     * @returns Promise<boolean> - true if the login page is displayed
     */
    async isLoginPageExists(): Promise<boolean> {
        try {
            await this.btnLogin.waitFor({ state: 'visible', timeout: 10000 });
            return await this.btnLogin.isVisible();
        } catch (error) {
            console.log(`Error checking login page: ${error}`);
            return false;
        }
    }
}
