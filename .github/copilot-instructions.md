# Algowars Web — Copilot Instructions

## Commands

**Package manager: pnpm (v10), Node 24**

```bash
pnpm dev              # dev server
pnpm build            # production build
pnpm lint             # ESLint
pnpm format:check     # Prettier check
pnpm format           # Prettier write

pnpm test             # run all unit tests (Vitest)
pnpm test:watch       # watch mode
pnpm test:coverage    # with coverage
pnpm test:int         # integration tests only (tests/integration/)

# Run a single test file
pnpm vitest run src/features/problem/problem-layout.test.tsx

pnpm e2e              # open Cypress UI
pnpm e2e:run          # headless Cypress
```

## Architecture

This is a **Next.js 16 App Router** app with **React 19**, inspired by [Bulletproof React](https://github.com/alan2207/bulletproof-react).

### Source layout

| Directory | Purpose |
|---|---|
| `src/app/` | Next.js App Router pages and layouts |
| `src/features/` | Feature-scoped modules — each feature is self-contained |
| `src/components/` | Shared reusable components; Shadcn components live in `src/components/ui/` |
| `src/common/` | Small set of cross-cutting utilities (pagination, etc.) |
| `src/lib/` | External library wrappers (`api-client`, `auth0`, `react-query`, `utils`) |
| `src/hooks/` | Custom React hooks |
| `tests/` | Integration tests (`tests/integration/`) and shared mocks/utils (`tests/mocks/`, `tests/utils/`) |

**Features must not import from other features.** Cross-feature data flows through `src/app/` or shared `src/lib/`.

### Key features

- `problem` — code editor, submissions, test-case runner
- `problems` — problems list, admin management
- `auth` — Auth0 login/logout/signup flows, route guards
- `account` — account setup and initialization
- `submission`, `test-suite`, `profile`, `settings`, `dashboard`

## Key Conventions

### API layer (per feature)

Every feature's `api/` directory follows a three-export pattern:

```ts
// 1. Plain async function
export const getProblemSetup = (...) => api.get<ProblemSetup>({ url: '...' });

// 2. queryOptions factory (for prefetching / SSR)
export const getProblemSetupQueryOptions = (...) =>
  queryOptions({ queryKey: [...], queryFn: () => getProblemSetup(...) });

// 3. Hook wrapping useQuery
export const useProblemSetup = ({ ..., queryConfig }: Options) =>
  useQuery({ ...getProblemSetupQueryOptions(...), ...queryConfig });
```

Use `ApiException` for error handling; never throw raw Axios errors.

### API client

Use `api.get<T>`, `api.post<T, TBody>`, etc. from `@/lib/api-client` — never use `axios` or `fetch` directly. The client automatically injects Auth0 bearer tokens (server-side and client-side).

### Router config

All in-app routes are declared in `src/router-config.ts`. Use `routerConfig` instead of string literals:

```ts
import { routerConfig } from '@/router-config';

// Static route
<Link href={routerConfig.problems.path} />

// Parameterized route
<Link href={routerConfig.problem.execute({ slug })} />
```

### Environment variables

All env vars are declared and validated in `src/env.js` using `@t3-oss/env-nextjs` + Zod. **Never use `process.env` directly** — import from `@/env` instead.

### Zustand stores

Use `devtools` + `subscribeWithSelector` middleware. Define separate `State` and `Actions` types, combined into a `Store` type:

```ts
type MyState = { ... };
type MyActions = { ... };
type MyStore = MyState & MyActions;

export const useMyStore = create<MyStore>()(
  subscribeWithSelector(devtools((set, get) => ({ ... })))
);
```

For testing, mock stores with `tests/mocks/zustand.ts` to enable store resets between tests.

### Shadcn / UI components

- Style: **new-york**, icon library: **lucide**
- Add components: `npx shadcn@latest add <component>`
- All Shadcn components go in `src/components/ui/` — do not modify them directly

### Formatting

Prettier enforces: **double quotes**, 2-space indent, ES5 trailing commas, LF line endings.

### Path aliases

- `@/` → `src/`
- `@tests/` → `tests/`

### Testing patterns

- Unit tests are **co-located** with source files (`.test.tsx` / `.test.ts` alongside the component)
- Integration tests live in `tests/integration/`
- Use `vi.mock()` for dependencies and `@testing-library/react` + `@testing-library/user-event` for rendering
- Use `@faker-js/faker` for test data generation
- Coverage thresholds: 80% lines/functions/statements, 75% branches
- `src/components/ui/`, `src/lib/`, `**/models/**`, and `**/api/**` are excluded from coverage
