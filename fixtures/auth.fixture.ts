import { test as base, expect, Page } from '@playwright/test';
import { ApiClient } from '../utils/ApiClient';

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page, request }, use) => {
    const apiClient = new ApiClient(request);
    const token = await apiClient.loginAndGetToken();

    await page.addInitScript((authToken: string) => {
      window.localStorage.setItem('token', authToken);
    }, token);

    await page.goto('./');
    await expect(page).toHaveURL(/dashboard/);
    await use(page);
  },
});

export { expect } from '@playwright/test';
