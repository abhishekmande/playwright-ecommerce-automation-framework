import { test, expect } from '../../fixtures/auth.fixture';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { testData } from '../../utils/env';

test('@regression user can add a product to cart', async ({ authenticatedPage: page, browserName }) => {
  test.skip(
    browserName !== 'chromium',
    'Cart mutation runs once to avoid shared-account cart interference; read-only catalogue coverage runs cross-browser.'
  );

  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);

  await productPage.expectLoaded();
  await productPage.addProductToCart(testData.productName);
  await productPage.openCart();
  await cartPage.expectProduct(testData.productName);

  await expect(page).toHaveURL(/cart/);
});
