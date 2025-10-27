import test from "@playwright/test";

test.describe("User Story: Authentication", () => {
  test("As user I can sign in and see my dashboard", async ({
    page,
    request,
  }) => {
    await test.step("Given I have a registered account", async () => {});
  });

  test("As a new user I can sign up", async ({ page, request }) => {});
});
