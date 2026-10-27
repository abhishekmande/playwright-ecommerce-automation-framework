import { expect, Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly countryInput: Locator;
  readonly countryResults: Locator;
  readonly placeOrderButton: Locator;
  readonly confirmationHeading: Locator;
  readonly orderId: Locator;

  constructor(private readonly page: Page) {
    this.countryInput = page.locator("[placeholder='Select Country']");
    this.countryResults = page.locator('.ta-results');
    this.placeOrderButton = page.locator('.action__submit');
    this.confirmationHeading = page.locator('.hero-primary');
    this.orderId = page.locator('.em-spacer-1 .ng-star-inserted');
  }

  async selectCountry(country: string): Promise<void> {
    const searchText = country.length >= 3 ? country.slice(0, 3) : country;
    await this.countryInput.fill(searchText);
    await expect(this.countryResults).toBeVisible();

    const option = this.page.locator('.ta-item').filter({ hasText: country }).last();
    await expect(option).toBeVisible();
    await option.click();
  }

  async placeOrder(): Promise<string> {
    await this.placeOrderButton.click();
    await expect(this.confirmationHeading).toContainText(/thank\s*you for the order/i);
    const id = (await this.orderId.first().textContent())?.trim();
    expect(id, 'Order id should be present after checkout').toBeTruthy();
    return id!;
  }
}
