import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { config } from "dotenv";
config({ path: ".env.test" });

const requiredEnvVars = ["NEXT_PUBLIC_API_SERVER_URL", "AUTH0_SECRET"];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Environment variable ${key} is required for tests`);
  }
});

afterEach(() => {
  cleanup();
});

// (Optional) Add any global test utilities, mocks, or polyfills here.
// Example mock (uncomment if you later need it):
// vi.mock('next/navigation', () => require('next-router-mock'))
