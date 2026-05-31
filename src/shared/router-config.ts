export const routerConfig = {
  authLogIn: { path: "/auth/login?returnTo=/account/callback" },
  authSignUp: {
    path: "/auth/login?screen_hint=signup&returnTo=/account/setup",
  },
  authLogOut: { path: "/auth/logout" },
  home: {
    path: "/",
  },
  problems: {
    path: "/problems",
  },
} as const;
