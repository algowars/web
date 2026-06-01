import test from "@playwright/test";

test("user should be able to log in and log out", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("sign-in-button").click();
});

test("user should be able to sign up", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("sign-up-button").click();
});
