import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Auto-clean DOM after each test
afterEach(() => {
  cleanup();
});

// (Optional) Add any global test utilities, mocks, or polyfills here.
// Example mock (uncomment if you later need it):
// vi.mock('next/navigation', () => require('next-router-mock'))
