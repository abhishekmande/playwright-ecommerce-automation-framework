import { APIRequestContext, expect } from '@playwright/test';
import { getCredentials } from './env';

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async loginAndGetToken(): Promise<string> {
    const { email, password } = getCredentials();
    const apiBaseUrl = process.env.API_BASE_URL || 'https://rahulshettyacademy.com/api/ecom';

    const response = await this.request.post(`${apiBaseUrl}/auth/login`, {
      data: {
        userEmail: email,
        userPassword: password,
      },
    });

    expect(response.ok(), `Login API failed with status ${response.status()}`).toBeTruthy();

    const body = await response.json();
    expect(body.token, 'Login response should contain a token').toBeTruthy();
    return body.token as string;
  }
}
