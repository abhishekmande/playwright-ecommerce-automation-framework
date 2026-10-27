import { expect, Locator, Page } from '@playwright/test';

export class OrdersPage {
  readonly rows: Locator;

  constructor(private readonly page: Page) {
    this.rows = page.locator('tbody tr');
  }

  async expectOrder(orderId: string): Promise<void> {
    const normalizedId = orderId.replace(/\|/g, '').trim();
    await expect(this.rows.filter({ hasText: normalizedId }).first()).toBeVisible();
  }
}
