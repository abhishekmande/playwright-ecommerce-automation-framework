export type TestCredentials = {
  email: string;
  password: string;
};

export function getCredentials(): TestCredentials {
  const email = process.env.USER_EMAIL?.trim();
  const password = process.env.USER_PASSWORD?.trim();

  if (!email || !password) {
    throw new Error(
      'Missing USER_EMAIL or USER_PASSWORD. Copy .env.example to .env and add credentials for a registered test account.'
    );
  }

  return { email, password };
}

export const testData = {
  productName: process.env.PRODUCT_NAME?.trim() || 'ZARA COAT 3',
  country: process.env.COUNTRY?.trim() || 'India',
};
