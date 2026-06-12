```typescript
import { BasePage } from './base-page';

export class LoginPage extends BasePage {
  private form = this.getLocator('#login-form');
  private usernameInput = this.getLocator('#username');
  private passwordInput = this.getLocator('#password');
  private submitButton = this.getLocator('#submit');

  constructor(page: Page) {
    super(page);
  }

  public async login(username: string, password: string): Promise<void> {
    try {
      await this.form.waitFor({ state: 'visible', timeout: 10000 });
      await this.usernameInput.fill(username);
      await this.passwordInput.fill(password);
      await this.submitButton.click();
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }
}
```