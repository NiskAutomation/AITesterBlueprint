import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type Fixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

export { expect };

test.beforeEach(async ({ loginPage }) => {
  await loginPage.navigate();
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const safeTitle = testInfo.title.replace(/[^a-zA-Z0-9]/g, '_');
    await page.screenshot({ path: `test-results/${safeTitle}-${Date.now()}.png` });
  }
});
