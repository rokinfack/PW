import { test as setup } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config(); // Charge .env

const adminFile = 'playwright/.auth/admin.json';
const userFile = 'playwright/.auth/user.json';

setup('authenticate as admin', async ({ page }) => {
  await page.goto('https://github.com/login');
  await page.getByLabel('Username or email address').fill(process.env.GITHUB_USERNAME!);
  await page.getByLabel('Password').fill(process.env.GITHUB_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.context().storageState({ path: adminFile });
});

setup('authenticate as user', async ({ page }) => {
  await page.goto('https://github.com/login');
  await page.getByLabel('Username or email address').fill(process.env.GITHUB_USERNAME!);
  await page.getByLabel('Password').fill(process.env.GITHUB_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.context().storageState({ path: userFile });
});
