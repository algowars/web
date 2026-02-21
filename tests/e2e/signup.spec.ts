import { test, expect } from '@playwright/test';
import crypto from 'crypto';

test.describe('Signup Flow', () => {
  test('should complete full signup flow from landing to account setup', async ({ page }) => {

    const timestamp = Date.now();
    const randomEmail = `e2e_${timestamp}@example.com`;
    const randomPassword = crypto.randomBytes(16).toString('base64');
    const randomUsername = `e2e${timestamp}`.slice(0, 16);

    await page.goto('/');

    await page.getByRole('link', { name: 'Sign Up' }).click();

    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill(randomEmail);

    await page.getByText('Password *').click();
    await page.getByRole('textbox', { name: 'Password' }).fill(randomPassword);

    await page.getByRole('button', { name: 'Continue', exact: true }).click();

    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill(randomUsername);
    await page.getByRole('button', { name: 'Setup Account' }).click();

    await expect(page).toHaveURL('/', { timeout: 10000 });
  });
});
