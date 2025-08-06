import { test as setup } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const username = process.env.GITHUB_USERNAME;
const password = process.env.GITHUB_PASSWORD;

if (!username || !password) {
  throw new Error('GITHUB_USERNAME or GITHUB_PASSWORD is not defined');
}

const adminFile = 'playwright/.auth/admin.json';
const userFile = 'playwright/.auth/user.json';

setup('authenticate as admin', async ({ page }) => {
  await page.goto('https://github.com/login');
  await page.getByLabel('Username or email address').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.context().storageState({ path: adminFile });
});

setup('authenticate as user', async ({ page }) => {
  await page.goto('https://github.com/login');
  await page.getByLabel('Username or email address').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.context().storageState({ path: userFile });
});
