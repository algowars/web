import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@tests": path.resolve(__dirname, "tests"),
    },
  },
  test: {
    include: [
      "src/**/*.test.{ts,tsx}",
      "src/**/*.spec.{ts,tsx}",
      "tests/integration/**/*.test.{ts,tsx}",
      "tests/integration/**/*.spec.{ts,tsx}",
    ],
    exclude: [
      "node_modules",
      ".next",
      "dist",
      "tests/utils/**",
      "cypress/**",
      "cypress.config.*",
    ],
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: false,
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["json-summary", "text"],
      reportsDirectory: "./coverage",
      exclude: [
        "vitest.config.*",
        "next.config.*",
        "**/*.d.ts",
        "dist/**",
        ".next/**",
        "tests/**",
        "src/lib/**",
        "src/hooks/use-mobile.*",
        "src/components/ui/**",
        "**/models/**",
        "src/components/blocks/**",
        "**/api/**",
        "src/components/editor/**",
        "eslint.config.mjs",
        "playwright.config.ts",
        "cypress.config.*",
        "cypress/**",
        "postcss.config.mjs",
        "proxy.ts",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
