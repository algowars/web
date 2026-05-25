import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("@/env", () => ({
  env: {
    AUTH0_DOMAIN: "test-auth0-domain",
    AUTH0_CLIENT_ID: "test-auth0-client-id",
    AUTH0_SECRET: "test-auth0-secret",
    AUTH0_CLIENT_SECRET: "test-auth0-client-secret",
    AUTH0_CALLBACK_URL: "http://localhost:3000/account/callback",
    AUTH0_AUDIENCE: "test-auth0-audience",
    NEXT_PUBLIC_API_SERVER_URL: "http://localhost:5035",
  },
}));
