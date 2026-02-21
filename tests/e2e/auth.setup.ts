import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../.auth/user.json");

/**
 * This setup test authenticates with Auth0 and saves the session state.
 * Other tests can reuse this state to skip login.
 *
 * To use authenticated state in tests:
 * 1. Run this setup first
 * 2. Configure projects in playwright.config.ts to use storageState
 */
setup("authenticate", async ({ page }) => {
  // Go to login page
  await page.goto("/auth/login?returnTo=/account/callback");

  // Wait for Auth0 login page
  await expect(page).toHaveURL(/auth0\.com/, { timeout: 10000 });

  // Fill in Auth0 credentials
  // Replace with your test account credentials
  await page
    .getByLabel("Email address")
    .fill(process.env.TEST_USER_EMAIL ?? "");
  await page.getByLabel("Password").fill(process.env.TEST_USER_PASSWORD ?? "");

  // Click continue/login button
  await page.getByRole("button", { name: /continue|log in/i }).click();

  // Wait for redirect back to app
  await expect(page).toHaveURL(/localhost:3000/, { timeout: 15000 });

  // Save authentication state
  await page.context().storageState({ path: authFile });
});
