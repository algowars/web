import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { resetAuth0State } from "@/test-utils/auth0-mock";

// Auto-clean DOM after each test
afterEach(() => {
  cleanup();
  resetAuth0State();
});

// (Optional) Add any global test utilities, mocks, or polyfills here.
// Example mock (uncomment if you later need it):
// vi.mock('next/navigation', () => require('next-router-mock'))
