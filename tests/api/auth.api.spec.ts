import { test, expect } from '@playwright/test';
import { ApiClient } from '../../utils/ApiClient';

test('@api login API returns an authentication token', async ({ request, browserName }) => {
  test.skip(browserName !== 'chromium', 'API contract test runs once; it is browser-independent.');

  const api = new ApiClient(request);
  const token = await api.loginAndGetToken();

  expect(token.length).toBeGreaterThan(20);
});
