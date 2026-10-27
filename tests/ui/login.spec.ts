import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductPage } from '../../pages/ProductPage';
import { getCredentials } from '../../utils/env';

test.describe('Authentication', () => {
  test('@smoke invalid user cannot login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const uniqueEmail = `not-a-user-${Date.now()}@example.com`;
    await loginPage.login(uniqueEmail, 'WrongPassword@123');
    await loginPage.expectLoginFailure();
  });

  test('@smoke registered user can login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const { email, password } = getCredentials();

    await loginPage.goto();
    await loginPage.login(email, password);
    await productPage.expectLoaded();
    await expect(page.locator('.card-body').first()).toBeVisible();
  });
});
