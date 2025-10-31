import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    include: [
      "src/**/*.test.{ts,tsx}",
      "src/**/*.spec.{ts,tsx}",
      "tests/integration/**/*.test.{ts,tsx}",
      "tests/integration/**/*.spec.{ts,tsx}",
    ],
    exclude: ["node_modules", ".next", "dist"],
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    css: true,
    coverage: {
      reporter: ["json-summary"],
      reportsDirectory: "./coverage",
      exclude: [
        "vitest.config.*",
        "next.config.*",
        "**/*.d.ts",
        "dist/**",
        ".next/**",
      ],
    },
  },
});
