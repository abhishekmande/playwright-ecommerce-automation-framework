import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly email: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly toast: Locator;

  constructor(private readonly page: Page) {
    this.email = page.locator('#userEmail');
    this.password = page.locator('#userPassword');
    this.loginButton = page.locator('#login');
    this.toast = page.locator('#toast-container');
  }

  async goto(): Promise<void> {
    await this.page.goto('./');
    await expect(this.email).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginButton.click();
  }

  async expectLoginFailure(): Promise<void> {
    await expect(this.toast).toContainText(/incorrect email or password/i);
  }
}
