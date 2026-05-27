import { test, expect } from '../fixtures/base-test';

test.describe('Login - Valid Scenarios', () => {
  test('Verify login page UI elements are displayed', async ({ loginPage }) => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.rememberMeCheckbox).toBeVisible();
  });

  test('Perform login with valid credentials format', async ({ loginPage }) => {
    await loginPage.enterUsername('validuser@example.com');
    await loginPage.enterPassword('ValidPass123!');
    await loginPage.toggleRememberMe();
    await loginPage.clickLogin();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Please check your username and password');
  });
});
