```typescript
import { Page } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
  }

  public async getURL(): Promise<string> {
    return this.page.url();
  }

  protected getLocator(selector: string) {
    return this.page.locator(selector);
  }
}
```