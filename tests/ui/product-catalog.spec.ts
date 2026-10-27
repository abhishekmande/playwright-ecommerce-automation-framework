import { test, expect } from '../../fixtures/auth.fixture';
import { ProductPage } from '../../pages/ProductPage';
import { testData } from '../../utils/env';

test('@regression product catalogue is available across supported browsers', async ({ authenticatedPage: page }) => {
  const productPage = new ProductPage(page);

  await productPage.expectLoaded();
  await expect(productPage.productCard(testData.productName)).toBeVisible();
});
