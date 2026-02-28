# Algowars Frontend – Interview Talk Track (Knowledge Services)

This is a “say it out loud” reference that ties real code decisions in this repo to full‑stack interview questions (Angular/.NET/SQL/Azure transferable patterns).

Last updated: 2026-01-24

## Current status (so you don’t over-claim)

- This doc is grounded in the frontend repo evidence links below.
- Backend-specific evidence is intentionally TODO until the backend API repo is opened in this same VS Code workspace.
- Multiplayer “real-time match/lobby” is treated as product vision/roadmap unless you can point to real-time backend code.

## Recruiter checklist (use this to prepare)

- Dress: treat it like an in-person interview (comfortable, confident, professional).
- Company homework: skim Knowledge Services’ solutions + culture pages and be ready to name 2–3 specifics (mission: “Serving those who serve others”, beliefs: Knowledge/Integrity/Service/Innovation, security/compliance emphasis like NIST SP 800-53).
- Role alignment: have talking points for each responsibility below and 1 example for at least 3 of them.
- Skills emphasis (highest interest per recruiter): Angular, C#/.NET, SQL Server, API development, Azure.
- If you’re missing something: explicitly map comparable tools/skills (e.g., “I used GitHub Actions; the concepts transfer to Azure DevOps pipelines”).
- Bring questions: ask about team workflow, mentorship, stack choices, and what success looks like in the first 60–90 days.

### 45–60s rehearsal scripts (practice these verbatim)

**Project pitch (frontend):**

“Algowars is a Next.js App Router frontend organized feature-first. For server state, it uses TanStack React Query with SSR prefetch + hydration on data-heavy pages so the first render is fast and doesn’t flicker. For high-frequency interaction state in the code editor, it uses a Zustand store so typing and local editor updates don’t fight the request cache. API calls go through one axios wrapper that normalizes error envelopes into a typed ApiException, which keeps UI components lean and predictable. The result is a codebase that’s easy to scale because state ownership is clear and feature modules own their own API and UI.”

Proof references:
- SSR prefetch/hydration: [src/app/problems/[slug]/page.tsx](src/app/problems/%5Bslug%5D/page.tsx)
- API boundary + error normalization: [src/lib/api-client.ts](src/lib/api-client.ts)
- Provider wiring (React Query + error boundary): [src/app/provider.tsx](src/app/provider.tsx)

**Behavioral (debugging/quality):**

“When something breaks, I try to reproduce quickly and shrink the problem. In Algowars, the first place I’d check is the API boundary to confirm the response envelope and error shape are what the UI expects. If it’s contract-related, fixing it at the boundary prevents scattered UI fixes. If it’s UI state, I separate whether it’s server state (React Query) or editor/local state (Zustand) and verify the correct owner is updating. I’ll add a focused test around the highest-risk logic rather than chasing symptoms.”

Proof references:
- Error/envelope handling: [src/lib/api-client.ts](src/lib/api-client.ts)
- Store tests (example): [src/features/problem/problem-editor-store.test.tsx](src/features/problem/problem-editor-store.test.tsx)

### 20–30s interview voice answers (Prompts 7–10)

**Prompt 7 — Frontend mental model:**

“This is a Next.js App Router frontend under `src/app`, and we also keep a centralized route helper for building URLs in [src/router-config.ts](src/router-config.ts). My mental model is three state boundaries: server state lives in React Query (global provider in [src/app/provider.tsx](src/app/provider.tsx) with defaults in [src/lib/react-query.ts](src/lib/react-query.ts)), auth is handled via Auth0 + an account context ([src/features/auth/account.context.tsx](src/features/auth/account.context.tsx)), and high-frequency editor state lives in a Zustand store ([src/features/problem/problem-editor-store.tsx](src/features/problem/problem-editor-store.tsx)). API calls go through a single axios wrapper that normalizes the response envelope and errors ([src/lib/api-client.ts](src/lib/api-client.ts)), so feature hooks just call `api.get`/`api.post` and the UI consumes typed results.”

**Prompt 8 — Component responsibility (example: ProblemLayout):**

“[src/features/problem/problem-layout.tsx](src/features/problem/problem-layout.tsx) is responsible for composing the problem page UI and wiring together data sources. It takes a `problem` and an `accessToken`, fetches the setup for the currently selected language, and syncs problem/setup into the editor store so the editor can render. It deliberately does not own API client details, error parsing, or auth mechanics—those are pushed down into the API boundary and auth context—so the component stays focused on orchestration and layout, not business rules.”

**Prompt 9 — API integration (how it talks to backend):**

“Requests are made in feature API modules—queries like paging problems in [src/features/problems/api/get-problems-pageable.ts](src/features/problems/api/get-problems-pageable.ts) and mutations like running a submission in [src/features/problem/api/run-submission.ts](src/features/problem/api/run-submission.ts). All of those call a shared client in [src/lib/api-client.ts](src/lib/api-client.ts) which enforces a consistent `{ data, errors, message }` envelope and throws a typed `ApiException` on failures. Auth gets passed as a Bearer token per request—either retrieved server-side on the page and passed down ([src/app/problems/[slug]/page.tsx](src/app/problems/%5Bslug%5D/page.tsx)), or managed client-side in the account context—and the client adds the `Authorization` header when an access token exists.”

**Prompt 10 — Performance/UX considerations (safe interview angle):**

“The big UX win is SSR prefetch plus hydration on the problem page so the first render has data and we avoid flicker ([src/app/problems/[slug]/page.tsx](src/app/problems/%5Bslug%5D/page.tsx)). For lists, we use `keepPreviousData` so pagination feels stable and doesn’t blank out between page changes ([src/features/problems/api/get-problems-pageable.ts](src/features/problems/api/get-problems-pageable.ts), [src/features/problems/problems-table-v2/problems-table-v2.tsx](src/features/problems/problems-table-v2/problems-table-v2.tsx)). For responsiveness, the code editor state is kept in Zustand instead of tying typing to request cache updates ([src/features/problem/problem-editor-store.tsx](src/features/problem/problem-editor-store.tsx)). And globally, we have an error boundary fallback UI so unexpected errors degrade gracefully ([src/app/provider.tsx](src/app/provider.tsx), [src/components/errors/main-error-fallback.tsx](src/components/errors/main-error-fallback.tsx)).”

### Responsibilities → ready-to-say talking points

- Design/develop/unit test web apps and APIs: “I keep controllers thin, validate at the boundary, and unit test service logic; on the UI I keep components lean and push logic into hooks/services.”
- Debugging with oversight: “I reproduce quickly, add targeted logs, write a failing test, then fix. If I’m blocked, I communicate early with what I’ve tried.”
- Clean, self-documenting code: “Small PRs, clear naming, clear DTOs, and consistent error handling so the next engineer can change it safely.”
- Peer reviews: “I ask for feedback early and I respond fast; I treat reviews as shared ownership, not gatekeeping.”
- Continuous learning: “I ramp by shipping one vertical slice with team conventions, then standardizing patterns.”
- Collaboration: “Contract-first communication (OpenAPI or shared DTOs), early alignment on error semantics, and proactive status updates.”

### Skill mapping (what to emphasize for this job)

- Angular: talk about components, services, DI, HttpClient/interceptors, routing, forms, RxJS, testing.
- C#/.NET: talk about controllers vs services, DTOs, validation, auth, unit tests, and exception-handling middleware.
- SQL Server: talk about relational modeling, indexing for query patterns, pagination, and reading query plans when needed.
- Azure/Azure DevOps: talk about CI/CD, environment config, secret management (Key Vault), observability, and safe deployments.

### “If I’m missing X” (the right way to answer)

- Acknowledge the gap briefly.
- Name the closest comparable thing you’ve used.
- Explain the conceptual mapping.
- Give a concrete ramp plan and timeline.

Example script:

“I haven’t shipped production workloads on Azure DevOps specifically, but I’ve worked with CI/CD pipelines and environment-based deployments. The core is the same—build, test, artifact, deploy, observe—so I’d ramp quickly by pairing on the first pipeline, then owning the next one.”

## Evidence map (grounded in this codebase)

Use this section when you want to “prove” a claim quickly. In interviews, you can say: “In this project, you can see that in X file…” and point to one of these.

### Frontend architecture proof points

- Feature-first structure (Bulletproof React inspired): [README.md](README.md)
- Centralized API wrapper + normalized error envelope: [src/lib/api-client.ts](src/lib/api-client.ts)
- React Query provider + global error boundary + toasts: [src/app/provider.tsx](src/app/provider.tsx)
- Global fallback UI for unexpected errors: [src/components/errors/main-error-fallback.tsx](src/components/errors/main-error-fallback.tsx)
- SSR prefetch + hydration on the problem page: [src/app/problems/[slug]/page.tsx](src/app/problems/%5Bslug%5D/page.tsx)
- Query pattern (getX/queryOptions/useX) and pagination smoothing: [src/features/problems/api/get-problems-pageable.ts](src/features/problems/api/get-problems-pageable.ts)
- Table consuming paged results and manual pagination state: [src/features/problems/problems-table-v2/problems-table-v2.tsx](src/features/problems/problems-table-v2/problems-table-v2.tsx)
- Auth status abstraction (unauth/partial/full) and access token retrieval: [src/features/auth/account.context.tsx](src/features/auth/account.context.tsx)
- High-frequency editor state kept out of React render tree via store: [src/features/problem/problem-editor-store.tsx](src/features/problem/problem-editor-store.tsx)

### API usage and UX state proof points

- Form validation + mutation success/failure UX: [src/features/account/setup/account-setup-form/account-setup-form.tsx](src/features/account/setup/account-setup-form/account-setup-form.tsx)
- “Run submission” mutation + UX feedback + local state update: [src/features/problem/problem-actions/problem-actions.tsx](src/features/problem/problem-actions/problem-actions.tsx)

### Contract dependency proof points (what breaks if backend changes)

- Response envelope expectation (`data/errors/message`) and thrown `ApiException`: [src/lib/api-client.ts](src/lib/api-client.ts)
- Pagination expects `results` + `total`: [src/features/problems/problems-table-v2/problems-table-v2.tsx](src/features/problems/problems-table-v2/problems-table-v2.tsx)

### Be explicit about what’s “implemented” vs “roadmap”

- Implemented: SSR hydration, query/mutation patterns, editor store, and submission run flow (files above).
- Roadmap/vision: real-time multiplayer match/lobby requires a server-authoritative match engine + WebSockets/SignalR and isn’t demonstrated in this frontend repo yet.

## Algowars STAR stories (100% code-grounded)

Use these for “Tell me about a time…” questions. Each story includes a one-line proof so you can point to code.

### Story A — Performance + UX: SSR prefetch and hydration

- Situation: problem pages need to feel fast and avoid layout flicker.
- Task: deliver a responsive problem experience while still using client-side interactivity.
- Action: prefetch the problem server-side into a QueryClient, dehydrate it, and hydrate on the client so the first render has data.
- Result: faster perceived load and fewer loading states at page entry.

Proof:
- SSR prefetch + hydration: [src/app/problems/[slug]/page.tsx](src/app/problems/%5Bslug%5D/page.tsx)

What to say if asked “tradeoffs?”
- “It adds complexity (dehydration/hydration), but improves perceived performance and gives us a cleaner first paint.”

### Story B — Reliability: centralized API error normalization

- Situation: multiple features call the API; duplicated axios error-handling leads to inconsistent UX.
- Task: make errors predictable (field/message) so forms and pages can render failures consistently.
- Action: wrap axios in a single API client that enforces one response envelope and throws a typed exception (`ApiException`) with structured errors.
- Result: less repeated boilerplate and more consistent error handling across features.

Proof:
- API wrapper + `ApiException`: [src/lib/api-client.ts](src/lib/api-client.ts)

What to say if asked “what could break?”
- “If the backend changes the `{ data/errors/message }` envelope, we’d update this single boundary instead of chasing errors across the UI.”

### Story C — State ownership: separating server state from editor interaction state

- Situation: the coding editor is high-frequency state (typing, language selection, run results) and doesn’t belong in request-cache state.
- Task: keep the UI responsive and predictable as data loads and the user interacts.
- Action: store editor interaction state in Zustand; keep server state in React Query; use effects to sync fetched setup/problem into the store.
- Result: smooth interaction and simpler mental model: server-state cache vs UI/editor state.

Proof:
- Store definition: [src/features/problem/problem-editor-store.tsx](src/features/problem/problem-editor-store.tsx)
- Wiring data into store: [src/features/problem/problem-layout.tsx](src/features/problem/problem-layout.tsx)

### Story D — End-to-end user action: “Run submission” with UX feedback

- Situation: users need to run code and see immediate feedback.
- Task: implement a reliable run action with clear loading and error feedback.
- Action: use a React Query mutation for `/submission/run`, track a local “running” state for button UX, reset prior results, store the new result, and toast success/failure.
- Result: a straightforward action flow the user can trust.

Proof:
- Run button flow + toasts: [src/features/problem/problem-actions/problem-actions.tsx](src/features/problem/problem-actions/problem-actions.tsx)
- Mutation hook: [src/features/problem/api/run-submission.ts](src/features/problem/api/run-submission.ts)

### Testing proof (only claim what exists)

- Unit test patterns exist in the repo; use them as “I value tests” evidence.
- Examples:
  - Store tests: [src/features/problem/problem-editor-store.test.tsx](src/features/problem/problem-editor-store.test.tsx)
  - Router config tests: [src/router-config.test.tsx](src/router-config.test.tsx)
  - React Query test utilities: [tests/utils/test-utils.tsx](tests/utils/test-utils.tsx)

If asked “coverage?”, be honest:
- “There are tests in place, but broad coverage is still a work in progress; I’d grow it around the highest-risk flows (auth, submissions, core pages).”

## Resume grounding (verified from your resume)

The goal: every “I did X” claim maps to a real project and a real artifact (repo link, PR, demo, screenshot, etc.). Everything below is based on your resume text.

### Verified resume snapshot (quick recall)

- Title/location: Full‑Stack Software Engineer (Clearwater, FL)
- Languages: JavaScript/TypeScript, Python, SQL, R
- Familiar with: C#, .NET, Node.js, Angular, React, REST APIs, PostgreSQL
- Tools/platforms: Azure, Docker, Git, GA4, VS Code
- Notable domains: Mobile Systems Security research + data science

### Project: AI Ad‑Lib Platform (Full‑Stack)

- Stack (resume): React, Tailwind CSS, PostgreSQL, Next.js, GA4, OpenAI API
- What you built (resume): full-stack web app enabling users to generate AI-powered ad-libs from prompts
- Scale/impact (resume): scaled to 6.2K+ monthly active users (via performance optimization + intuitive UI)

Interview emphasis to connect to the job:
- Product + performance: you can talk about performance work tied to an actual metric (MAUs)
- API integration: OpenAI API + analytics instrumentation (GA4)

### Project: Algowars (Full‑Stack)

- Core stack (resume): C#, .NET 9, ASP.NET Core, PostgreSQL, TypeScript, React 19, Next.js, Tailwind CSS
- What you built (resume): gamified coding platform enabling real-time algorithm challenges and scoring
- Specific features you can claim (resume): built user profile system; integrated third-party code execution API (Judge0)

Interview emphasis to connect to the job:
- .NET API thinking: endpoints, DTOs, validation, auth, error handling
- Systems mindset: integrating an external execution provider has reliability/security constraints

### Experience: Research Assistant – Mobile Systems Security

- What you did (resume): built predictive models using hybrid fuzzy-genetic algorithms; improved performance by 10–15%; presented findings weekly

Interview emphasis to connect to Knowledge Services:
- Security-adjacent domain exposure + disciplined experimentation + clear communication

### Angular (how to answer truthfully)

- Resume truth: “Familiar with Angular.”
- Suggested interview phrasing:
  - “I’m familiar with Angular fundamentals (components, services, DI, routing). My strongest shipped SPA work is React/Next.js, but the patterns translate cleanly. If you want me productive fast, I’ll implement one vertical slice in Angular using your team conventions, then standardize around the patterns you prefer.”

### SQL Server (how to bridge from Postgres)

- Resume truth: you have SQL + PostgreSQL experience.
- Suggested interview phrasing:
  - “I’ve used SQL heavily with Postgres. The relational fundamentals transfer directly to SQL Server—schema design, indexing to query patterns, pagination, and reading execution plans. I’ll adapt to SQL Server-specific tooling and tuning quickly.”

### Azure / Azure DevOps (be careful and credible)

- Resume truth: Azure listed under tools/platforms.
- If asked for details and you only have limited exposure, use the recruiter-safe pattern:
  - “I’ve used Azure at a basic level and I’m comfortable with cloud fundamentals: environment config, secrets, CI/CD concepts, and observability. If you’re using Azure DevOps heavily, I can ramp quickly by pairing on the first pipeline and then owning one end-to-end.”

## Resume-based STAR stories (from your resume facts)

These are “plug and play” behavioral answers. Keep them short unless prompted.

### STAR 1 — Shipping a product that scaled (AI Ad‑Lib Platform)

- Situation: you needed a usable AI-powered product, not just a demo.
- Task: build a full-stack workflow end-to-end and make it stable and intuitive for real users.
- Action: implemented the Next.js/React UI, integrated the OpenAI API, and optimized UX/performance; added analytics (GA4) to understand usage.
- Result (resume): grew to 6.2K+ monthly active users.

### STAR 2 — Integrating an external service safely (Algowars + Judge0)

- Situation: competitive coding needs reliable execution of untrusted code.
- Task: integrate a third-party execution API while keeping the platform usable and predictable.
- Action (resume): integrated Judge0; built a user profile system to support a real product experience around challenges.
- Result: enabled a core end-to-end flow for the platform (code → run → result) and supported user identity/profiles.

### STAR 3 — Research discipline and communication (Mobile Systems Security)

- Situation: short research window with weekly expectations.
- Task: produce measurable model improvements and communicate progress clearly.
- Action (resume): implemented hybrid fuzzy-genetic algorithms, visualized datasets, presented weekly updates.
- Result (resume): improved performance by 10–15% and supported the publication process.

## 1) 30–45 second project pitch

Algowars is a Next.js client built in a feature-first structure inspired by Bulletproof React. It uses Auth0 for auth, TanStack React Query for server-state caching and SSR hydration, and Zustand for high-frequency local state in the coding editor. The codebase separates UI primitives from feature modules and centralizes API communication and error normalization.

## 2) Product vision: “multiplayer LeetCode” (how to say it)

Say it like this (20–30 seconds):

Algowars turns the LeetCode-style coding experience into a true multiplayer game. Instead of solving alone and comparing scores later, players compete in the same challenge at the same time: shared start, real-time progress, and a clear winner condition. The goal is to make coding practice feel like a match, not just a leaderboard.

What makes it multiplayer (not “just a scoreboard”):
- Players join a match/lobby that represents a real shared session.
- The server synchronizes timing (countdown/start/end) and scoring.
- Real-time events broadcast to all players (joins, start, submissions, results).
- Server-authoritative rules to ensure fairness (anti-cheat and consistency).

High-level architecture (good full-stack answer):
- REST for initial state and CRUD (problems, match creation/join, history).
- Real-time channel (WebSockets / SignalR) for match events and live scoreboard updates.
- Server-authoritative “match engine” service owns rules, scoring, and timers.

Risks + mitigations (sounds senior without over-selling):
- Fairness/cheating: server-side evaluation, rate limits, audit logs.
- Scale spikes: fanout strategy for events, backpressure, and efficient payloads.
- UX under latency: optimistic UI for local typing, authoritative updates for scoring.

Reference:
- Architecture overview: [README.md](README.md)

## 3) How the frontend is structured (and why it scales)

### Feature-first modules
- Product logic lives under `src/features/*` (each feature owns its API calls, state, models, and UI components).
- Shared UI primitives live under `src/components/ui/*` (shadcn-style building blocks).

Why this scales:
- Reduces cross-feature coupling (features don’t reach into each other’s internals).
- Makes “owning a feature” clear for onboarding and reviews.

Reference examples:
- Feature API hook pattern: [src/features/problems/api/get-problems-pageable.ts](src/features/problems/api/get-problems-pageable.ts)
- Feature UI consumes hooks + primitives: [src/features/problems/problems-table-v2/problems-table-v2.tsx](src/features/problems/problems-table-v2/problems-table-v2.tsx)

### Where state lives (and why)
- Auth state: React Context because it’s app-wide and used in multiple flows.
  - [src/features/auth/account.context.tsx](src/features/auth/account.context.tsx)
- Server state: React Query cache because it provides request lifecycle, caching, invalidation, and SSR hydration.
  - [src/app/provider.tsx](src/app/provider.tsx)
  - [src/lib/react-query.ts](src/lib/react-query.ts)
- Editor state: Zustand store because editor updates are frequent and shared across components.
  - [src/features/problem/problem-editor-store.tsx](src/features/problem/problem-editor-store.tsx)
- Page-level UI state: local component state (pagination/filtering inputs).
  - [src/features/problems/problems-table-v2/problems-table-v2.tsx](src/features/problems/problems-table-v2/problems-table-v2.tsx)

## 4) Frontend vs backend responsibilities (full-stack awareness)

### Frontend responsibilities (in this repo)
- Render UI, manage interaction state, and provide consistent loading/empty/error UX.
- Orchestrate calls to the backend (query/mutation), but avoid embedding business rules.
- Normalize errors so UI components don’t need to understand axios/network details.

References:
- Central API client and error normalization: [src/lib/api-client.ts](src/lib/api-client.ts)
- Global error boundary fallback: [src/app/provider.tsx](src/app/provider.tsx), [src/components/errors/main-error-fallback.tsx](src/components/errors/main-error-fallback.tsx)

### Backend responsibilities (what you’d expect behind these endpoints)
- Authorization and security policy (who can run/submit, who can access admin endpoints).
- Business rules (submission execution, problem visibility, validation beyond basic form checks).
- Data integrity and canonical domain model.

Interview line:
- “Frontend decides how to *present* and *sequence* actions; backend decides what is *allowed*, *valid*, and *persisted*.”

## 5) What logic is intentionally kept out of UI components

Kept out:
- HTTP request setup and envelope parsing.
- Token header wiring.
- Query key construction and caching/invalidation rules.

Where it lives instead:
- API client: [src/lib/api-client.ts](src/lib/api-client.ts)
- Feature API modules (getX/queryOptions/useX): [src/features/problems/api/get-problems-pageable.ts](src/features/problems/api/get-problems-pageable.ts)

Interview line:
- “UI components are mostly pure render + event handlers; data and side effects sit in hooks/services.”

## 6) How dependent the frontend is on API contracts

High dependency points:
1) **Response envelope contract**
   - The API client assumes `{ data?: T; errors?: ApiError[]; message?: string }`.
   - If the backend changes this shape, error handling breaks system-wide.
   - Reference: [src/lib/api-client.ts](src/lib/api-client.ts)

2) **Pagination shape**
   - Table expects `PageResult` with `results` and `total`.
   - Reference: [src/features/problems/problems-table-v2/problems-table-v2.tsx](src/features/problems/problems-table-v2/problems-table-v2.tsx)

3) **Domain shapes used by stores**
   - Editor store expects problem languages/versions to compute defaults.
   - Reference: [src/features/problem/problem-editor-store.tsx](src/features/problem/problem-editor-store.tsx)

## 7) What would break if backend responses changed unexpectedly

Concrete break examples you can say:
- “If the backend stops returning `errors` inside the expected envelope, the client may treat failures as successes or throw generic errors.”
- “If pagination no longer returns `total/results`, the data table will render empty pages and incorrect counts.”
- “If submission status encoding changes (e.g. numeric → string), status-to-text mapping becomes wrong.”

References:
- Envelope parsing/throwing: [src/lib/api-client.ts](src/lib/api-client.ts)
- Table usage of `results/total`: [src/features/problems/problems-table-v2/problems-table-v2.tsx](src/features/problems/problems-table-v2/problems-table-v2.tsx)
- Status mapping: [src/features/problem/submission-result/submission-result.tsx](src/features/problem/submission-result/submission-result.tsx)

## 8) Frontend–backend communication (loading/success/error)

Patterns used:
- React Query for request state (pending/fetching/data/error) and caching.
- `keepPreviousData` for smooth pagination without UI flicker.
- Toasts for mutation feedback.
- Error boundary for unexpected crashes.

References:
- Query config: [src/lib/react-query.ts](src/lib/react-query.ts)
- Pagination placeholder: [src/features/problems/api/get-problems-pageable.ts](src/features/problems/api/get-problems-pageable.ts)
- Mutation + UX feedback: [src/features/problem/problem-actions/problem-actions.tsx](src/features/problem/problem-actions/problem-actions.tsx)

## 9) UX vs engineering tradeoffs (good interview talking points)

Tradeoffs you can defend:
- SSR prefetch + hydration adds complexity but improves perceived performance and SEO.
  - Reference: [src/app/problems/[slug]/page.tsx](src/app/problems/%5Bslug%5D/page.tsx)
- Central error normalization reduces duplicated error handling, but makes the app sensitive to envelope changes.
  - Reference: [src/lib/api-client.ts](src/lib/api-client.ts)

One improvement you can propose (without criticizing):
- Add runtime response validation (Zod) at the API boundary for 2–3 critical endpoints.
- Keep UI stable by mapping “backend DTO” → “frontend view model” in feature API modules.

## 10) React → Angular translation (what to say, concretely)

Mapping:
- Feature API modules → Angular services.
- Axios interceptors → Angular HTTP interceptors.
- React Query cache → RxJS-driven caching in services (or NgRx if the app needs global coordination).
- Context/Zustand → DI-backed services (or NgRx store for shared state).

Interview line:
- “The architecture is portable: stable contracts + boundary adapters + predictable state ownership.”

## 11) Knowledge Services tie-in (why them)

Talking points grounded in their site:
- Mission alignment: “Serving those who serve others.”
- Security/compliance mindset: they mention NIST SP 800-53 compliant SaaS.
- Products emphasize transparency, oversight, reporting—good engineering hygiene (auditability, observability, correctness).

## 12) Questions to ask Mike Born

- “What are the first systems this new Scrum team will modernize for the cybersecurity initiatives?”
- “What are your standards around API versioning and contract changes?”
- “How do you balance shipping features with security/compliance requirements (NIST, audit logging)?”
- “What does success look like for a Software Engineer I in the first 60–90 days?”

---

# Algowars Backend – Interview Talk Track (for the .NET API repo)

This section is meant to be copied into the backend repo (or kept alongside it) so you can speak confidently about C#/.NET, API design, SQL Server patterns, and Azure. Once the backend folder is opened in the same VS Code workspace, replace the TODO placeholders with real file links (Program.cs, controllers, services, data access, tests).

## How to make this section code-grounded

1) Open the backend repo in this workspace (VS Code: File → Add Folder to Workspace…)
2) Replace the TODO placeholders in section 20 with real links
3) Add a short “Backend evidence map” (entrypoint/middleware, auth, one controller, one service, one data access path, one test)

## 13) 30–45 second backend pitch

Algowars backend is a versioned REST API that enforces authentication/authorization, implements the domain rules (problems, setups, submissions), and returns stable DTOs for the SPA. I keep controllers thin, push business logic into services, validate inputs, and rely on consistent error responses so the frontend can render errors predictably. I also care about observability (structured logs + correlation IDs) because production debugging should be fast.

## 14) Backend responsibilities vs frontend (say it like this)

- Backend owns: authorization, domain rules, persistence, performance, and contract stability.
- Frontend owns: UI state, user experience, and orchestration of API calls.

Interview line:
- “Frontend asks for outcomes; backend guarantees correctness, security, and consistency.”

## 15) API design choices (what interviewers care about)

### Endpoints and contracts
- Keep endpoints resource-oriented and versioned (e.g. `/api/v1/...`).
- Use DTOs (don’t leak EF entities / internal domain objects).
- Define a consistent error shape (field-level errors + message) so the UI can show validation errors cleanly.

### Validation and error handling
- Validate at the boundary (model binding + fluent validation or manual validation).
- Return 400 for validation problems, 401/403 for auth issues, 404 for missing resources.
- Prefer a single global exception handler/middleware that maps exceptions → proper responses.

### Security posture (especially relevant to Knowledge Services)
- AuthN: validate JWT/access tokens.
- AuthZ: role/permission checks per endpoint (admin routes, submission actions).
- Audit-friendly behavior: stable IDs, clear error messages, no sensitive data in logs.

## 16) Data and SQL Server talking points

### Data modeling
- Use relational modeling aligned to query patterns (problem → setups → test suites → submissions).
- Add indexes based on real API queries: pagination ordering, filters, lookups by slug, etc.

### Pagination
- Page-based (`page/size`) is simple; cursor-based is more stable for large datasets.
- If the frontend uses `total/results`, backend should keep it consistent and fast.

### Performance debugging
- Start with slow endpoint traces → check SQL query plan → add index or reduce joins.
- Avoid N+1 patterns (especially if using an ORM).

## 17) Testing story (unit tests + debugging)

What to say:
- “I unit test service-layer logic heavily and keep controller tests focused on routing + status codes.”
- “I treat ‘contract behavior’ as testable: validation errors, not found, unauthorized, and happy paths.”

Example categories to mention:
- Service tests (business rules)
- Repository/data access tests (if applicable)
- Integration tests for controllers (in-memory hosting / test server)

## 18) Azure / DevOps story (what to highlight)

If they ask Azure-specific questions, keep it practical:
- Config via environment variables + secret management (Key Vault) rather than hardcoding.
- CI/CD: build, run tests, publish artifacts, deploy to environment.
- Observability: App Insights/Log Analytics, structured logs, health checks.
- Reliability: retries for outbound calls, timeouts, graceful failures.

## 19) How to talk about collaboration and contract changes

This is a strong “manager-ready” answer:
- “I want a single source of truth for contracts (OpenAPI/Swagger), a versioning policy, and additive changes by default.”
- “When a breaking change is needed, we version the endpoint or keep backward compatibility during a migration window.”
- “Frontend + backend align on error semantics early so UX doesn’t become guesswork.”

## 20) TODO: Replace these placeholders once backend is in the workspace

Fill these in with real paths once you open the backend folder in VS Code:
- API entrypoint / middleware pipeline: TODO (Program.cs)
- Controllers (routing + status codes): TODO
- Services (business logic): TODO
- Data access (EF DbContext / repositories): TODO
- DB migrations / schema: TODO
- Authentication/authorization config: TODO
- Unit/integration tests: TODO

