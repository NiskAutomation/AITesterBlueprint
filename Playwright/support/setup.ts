```typescript
import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';

export interface Fixtures {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
}

export const test = baseTest.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  }
});

export const { expect } = test;
```