import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator("//label[text()='Username']/following-sibling::div//input[@type='email']");
    this.passwordInput = page.locator("//label[text()='Password']/following-sibling::input[@type='password']");
    this.loginButton = page.locator("//input[@value='Log In']");
    this.rememberMeCheckbox = page.locator("//label[contains(text(),'Remember me')]/preceding-sibling::input[@type='checkbox']");
    this.errorMessage = page.locator("//div[starts-with(text(),'Error:')]");
  }

  async navigate(): Promise<void> {
    try {
      await this.page.goto('/?locale=in', { waitUntil: 'domcontentloaded' });
      await expect(this.usernameInput).toBeVisible();
    } catch (error) {
      throw new Error(`Failed to navigate to login page: ${error}`);
    }
  }

  async enterUsername(username: string): Promise<void> {
    try {
      await this.usernameInput.fill(username);
    } catch (error) {
      throw new Error(`Failed to enter username: ${error}`);
    }
  }

  async enterPassword(password: string): Promise<void> {
    try {
      await this.passwordInput.fill(password);
    } catch (error) {
      throw new Error(`Failed to enter password: ${error}`);
    }
  }

  async clickLogin(): Promise<void> {
    try {
      await this.loginButton.click();
    } catch (error) {
      throw new Error(`Failed to click login button: ${error}`);
    }
  }

  async toggleRememberMe(): Promise<void> {
    try {
      await this.rememberMeCheckbox.check();
    } catch (error) {
      throw new Error(`Failed to toggle remember me: ${error}`);
    }
  }

  async doLogin(username: string, password: string): Promise<void> {
    try {
      await this.enterUsername(username);
      await this.enterPassword(password);
      await this.clickLogin();
    } catch (error) {
      throw new Error(`Login action failed: ${error}`);
    }
  }

  async getErrorMessage(): Promise<string> {
    try {
      await expect(this.errorMessage).toBeVisible();
      return await this.errorMessage.innerText();
    } catch (error) {
      throw new Error(`Failed to retrieve error message: ${error}`);
    }
  }

  async isErrorDisplayed(): Promise<boolean> {
    try {
      return await this.errorMessage.isVisible();
    } catch (error) {
      throw new Error(`Failed to check error visibility: ${error}`);
    }
  }
}
