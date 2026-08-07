import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import reactHooks from "eslint-plugin-react-hooks";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  reactHooks.configs.flat["recommended-latest"],

  // --- Redux Toolkit best practices ---
  {
    rules: {
      // Force typed hooks (useAppSelector/useAppDispatch/useAppStore) instead
      // of the untyped react-redux hooks.
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react-redux",
              importNames: ["useSelector", "useDispatch", "useStore"],
              message:
                "Use typed hooks from '@/app/hooks' instead (useAppSelector, useAppDispatch, useAppStore).",
            },
          ],
        },
      ],

      // Catch un-awaited / un-unwrapped dispatch(thunk()) and RTK Query calls.
      "@typescript-eslint/no-floating-promises": "error",

      // Redux slices/features often import each other's selectors/types.
      "import/no-cycle": "error",

      // Loosened since Immer (via createSlice) makes controlled "mutation" safe.
      "no-param-reassign": ["warn", { props: false }],
    },
  },

  // Since you're on RTK Query, ban manual data-fetching inside store/feature
  // code so all fetching goes through RTK Query endpoints.
  {
    files: ["**/store/**", "**/features/**", "**/*slice*", "**/*Slice*"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "axios",
              message:
                "Use RTK Query endpoints instead of axios for data fetching.",
            },
          ],
        },
      ],
      "no-restricted-globals": [
        "error",
        {
          name: "fetch",
          message: "Use RTK Query endpoints instead of raw fetch.",
        },
      ],
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
