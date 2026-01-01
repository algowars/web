/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/no-unused-vars */
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "tests/**/*.ts", "tests/**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    ignores: [
      "src/components/editor/**",
      "src/features/problems/admin-problems-table/**",
    ],
  },
];
