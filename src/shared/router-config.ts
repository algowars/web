export const routerConfig = {
  authLogIn: { path: "/auth/login" },
  authSignUp: {
    path: "/auth/login?screen_hint=signup&returnTo=/user/setup",
  },
  authLogOut: { path: "/auth/logout" },
  home: {
    path: "/",
  },
  dashboard: {
    path: "/dashboard",
  },
  gamePlay: {
    path: "/game/play/:gameId",
    execute: ({ gameId }: { gameId: string }) =>
      `/game/play/${encodeURIComponent(gameId)}`,
  },
  games: {
    path: "/games",
    execute: (params?: { mode?: string }) =>
      params?.mode
        ? `/games?mode=${encodeURIComponent(params.mode)}`
        : "/games",
  },
  problems: {
    path: "/problems",
  },
  problem: {
    path: "/problems/:slug",
    execute: ({ slug }: { slug: string }) =>
      `/problems/${encodeURIComponent(slug)}`,
  },
  problemSubmissions: {
    path: "/problems/:slug/submissions",
    execute: ({ slug }: { slug: string }) =>
      `/problems/${encodeURIComponent(slug)}/submissions`,
  },
  profile: {
    path: "/profile/:username",
    execute: ({ username }: { username: string }) =>
      `/profile/${encodeURIComponent(username)}`,
  },
  profileSettings: { path: "/settings" },
} as const;
