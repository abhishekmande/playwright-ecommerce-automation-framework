import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
  readonly productNames: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.productNames = page.locator('.cartSection h3');
    this.checkoutButton = page.getByRole('button', { name: /checkout/i });
  }

  async expectProduct(productName: string): Promise<void> {
    await expect(this.productNames.filter({ hasText: productName })).toBeVisible();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/order/);
  }
}
