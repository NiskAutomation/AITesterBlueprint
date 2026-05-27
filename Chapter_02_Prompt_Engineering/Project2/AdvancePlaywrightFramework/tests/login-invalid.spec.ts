import { test, expect } from '../fixtures/base-test';

test.describe('Login - Invalid Scenarios', () => {
  test('Login with empty username and password', async ({ loginPage }) => {
    await loginPage.clickLogin();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Please enter your username and password');
  });

  test('Login with invalid credentials', async ({ loginPage }) => {
    await loginPage.enterUsername('invaliduser@example.com');
    await loginPage.enterPassword('WrongPass123!');
    await loginPage.clickLogin();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Please check your username and password');
  });

  test('Login with empty password only', async ({ loginPage }) => {
    await loginPage.enterUsername('user@example.com');
    await loginPage.clickLogin();
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Please enter your password');
  });
});
