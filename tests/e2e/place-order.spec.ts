import { test } from '../../fixtures/auth.fixture';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { OrdersPage } from '../../pages/OrdersPage';
import { testData } from '../../utils/env';

test('@regression @e2e user can place an order and verify it in order history', async ({
  authenticatedPage: page,
  browserName,
}) => {
  test.skip(
    browserName !== 'chromium',
    'State-changing order creation is intentionally executed once in Chromium; cross-browser coverage is handled by authentication/cart tests.'
  );

  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const ordersPage = new OrdersPage(page);

  await productPage.addProductToCart(testData.productName);
  await productPage.openCart();
  await cartPage.expectProduct(testData.productName);
  await cartPage.checkout();
  await checkoutPage.selectCountry(testData.country);
  const orderId = await checkoutPage.placeOrder();

  await productPage.openOrders();
  await ordersPage.expectOrder(orderId);
});
