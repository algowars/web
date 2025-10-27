<div align="center">

# Algowars Client

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs) ![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=222) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript) ![Vitest](https://img.shields.io/badge/Vitest-3-6E9F18?logo=vitest)

</div>

## Overview

Algowars SSR is a Next.js application for practicing and competing on algorithmic challenges. It includes authentication (Auth0), an admin interface for creating problems and test suites, rich text/code editors, user profiles, and a problems catalog — all rendered with SSR for performance and SEO.Key routes:

- `/` Home (Landing or Dashboard based on auth state)
- `/admin` Admin dashboard
- `/problems` Problems list and filtering
- `/profile/[username]` Public profile
- `/settings/*` Authenticated user settings

## Tech Stack

- Next.js 15 (App Router) + React 19
- TypeScript
- Auth0 (authentication/authorization)
- CodeMirror (rich editor + code highlighting)
- Tailwind CSS
- TanStack Query / Table
- Vitest + Testing Library (unit/integration)
- Playwright (e2e)

## Quick Start

1. Install dependencies (pnpm recommended):

```bash
pnpm install
```

2. Configure environment variables:

```bash
cp .env.example .env.local
```

3. Run the development server:

```bash
pnpm dev
```

Open http://localhost:3000 to view the app.

## Environment Variables

Create a `.env` file based on `.env.example`.

Public (exposed to browser via NEXT*PUBLIC*):

- `NEXT_PUBLIC_AUTH0_DOMAIN`
- `NEXT_PUBLIC_AUTH0_CLIENT_ID`
- `NEXT_PUBLIC_AUTH0_CALLBACK_URL`
- `NEXT_PUBLIC_AUTH0_AUDIENCE`
- `NEXT_PUBLIC_API_SERVER_URL`
- `NEXT_PUBLIC_AUTH0_NAMESPACE`

Server-side only:

- `AUTH0_SECRET`
- `APP_BASE_URL`
- `AUTH0_DOMAIN`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`

## Scripts

- `pnpm dev` — Start dev server (Turbopack)
- `pnpm build` — Production build
- `pnpm start` — Start production server
- `pnpm lint` — Run ESLint
- `pnpm test` — Run unit/integration tests (Vitest)
- `pnpm test:watch` — Watch mode
- `pnpm test:coverage` — Coverage
- `pnpm test:e2e` — Run Playwright e2e tests
- `pnpm test:e2e:ui` — Playwright UI mode

## Project Structure

```
src/
  app/                 # App Router pages/layouts (SSR)
  components/          # Reusable UI components and editor blocks
  features/            # Feature-oriented modules (auth, problems, profile, admin, etc.)
  lib/                 # Utilities and shared libs
  hooks/               # Custom React hooks
  common/              # Common types and helpers
```

## Development Notes

- Auth: App uses Auth0; configure callback URL and allowed origins in the Auth0 dashboard to match your `.env`.
- API: Set `API_SERVER_URL` to your backend (default `http://localhost:5035`).
- Styling: TailwindCSS with PostCSS; adjust global styles in `src/app/globals.css`.

## Deployment

This app is optimized for deployment on Vercel. See Next.js docs for SSR deployment: https://nextjs.org/docs/app/building-your-application/deploying

## Contributing

Issues and PRs are welcome. If contributing:

- Create a feature branch
- Add/adjust tests when applicable
- Follow existing code style and structure

## License

Proprietary unless stated otherwise by the repository owner.
