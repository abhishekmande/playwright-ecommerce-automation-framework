import { expect, Locator, Page } from '@playwright/test';

export class ProductPage {
  readonly productCards: Locator;
  readonly cartButton: Locator;
  readonly ordersButton: Locator;
  readonly toast: Locator;
  readonly spinner: Locator;

  constructor(private readonly page: Page) {
    this.productCards = page.locator('.card-body');
    this.cartButton = page.locator("[routerlink*='cart']");
    this.ordersButton = page.locator("[routerlink*='myorders']");
    this.toast = page.locator('#toast-container');
    this.spinner = page.locator('.ng-animating');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(this.productCards.first()).toBeVisible();
  }

  productCard(productName: string): Locator {
    return this.productCards.filter({ hasText: productName }).first();
  }

  async addProductToCart(productName: string): Promise<void> {
    const card = this.productCard(productName);
    await expect(card, `Product ${productName} should be visible`).toBeVisible();
    await card.getByRole('button', { name: /add to cart/i }).click();
    await expect(this.toast).toContainText(/product added to cart/i);
    await this.spinner.waitFor({ state: 'hidden' }).catch(() => undefined);
  }

  async openCart(): Promise<void> {
    await this.cartButton.click();
    await expect(this.page).toHaveURL(/cart/);
  }

  async openOrders(): Promise<void> {
    await this.ordersButton.click();
    await expect(this.page).toHaveURL(/myorders/);
  }
}
