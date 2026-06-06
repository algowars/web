export const routerConfig = {
  authLogIn: { path: "/auth/login" },
  authSignUp: {
    path: "/auth/login?screen_hint=signup&returnTo=/account/setup",
  },
  authLogOut: { path: "/auth/logout" },
  home: {
    path: "/",
  },
  dashboard: {
    path: "/dashboard",
  },
  problems: {
    path: "/problems",
  },
  problem: {
    path: "/problems/:slug",
    execute: ({ slug }: { slug: string }) =>
      `/problems/${encodeURIComponent(slug)}`,
  },
  profile: {
    path: "/profile/:username",
    execute: ({ username }: { username: string }) =>
      `/profile/${encodeURIComponent(username)}`,
  },
  profileSettings: { path: "/settings" },
} as const;
