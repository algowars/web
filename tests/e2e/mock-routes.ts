import type { Page } from "@playwright/test";
import { User } from "@auth0/nextjs-auth0/types";

export async function registerMockRoutes(page: Page) {
  await page.route("/auth/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        user: {
          sub: "auth0|123",
          email: "test@example.com",
          name: "Test User",
        },
      }),
    });
  });

  await page.route("/auth/login", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ redirectUrl: "/dashboard", ok: true }),
    });
  });

  await page.route("/auth/logout", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
  });

  await page.route("/auth/callback", async (route) => {
    await route.fulfill({ status: 200, body: "ok" });
  });
}

export function getSessionMock(): { user: User } {
  return {
    user: {
      sub: "auth0|123",
      name: "Test User",
      email: "test@example.com",
      email_verified: true,
    },
  };
}
