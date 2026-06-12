```typescript
import { BasePage } from './base-page';

export class DashboardPage extends BasePage {
  private welcomeMessage = this.getLocator('.welcome-message');

  constructor(page: Page) {
    super(page);
  }

  public async verifyWelcomeMessage(expectedUser: string): Promise<boolean> {
    try {
      const text = await this.welcomeMessage.textContent();
      return text?.includes(expectedUser) ?? false;
    } catch (error) {
      throw new Error(`Failed to verify welcome message: ${error.message}`);
    }
  }
}
```