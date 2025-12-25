// tests/auth.setup.ts
import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  await page.goto('https://conduit.bondaracademy.com/');

  await page.getByRole('link', { name: 'Sign in' }).click();

  await page.getByRole('textbox', { name: 'Email' }).fill('testgen@test.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('test12345678');

  await page.getByRole('button', { name: 'Sign in' }).click();

  // Wait for successful login (tags API is a good indicator)
  await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags');

  // Save storage state (cookies + localStorage)
  await page.context().storageState({ path: authFile });
});