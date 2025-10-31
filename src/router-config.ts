/* eslint-disable @typescript-eslint/no-explicit-any */

type RouteEntry = {
  path: string;
  execute?: (args: any) => string;
  asArray?: string[];
};

const _routerConfig = {
  home: {
    path: "/",
  },
  authSignUp: {
    path: "/auth/login?screen_hint=signup",
  },
  authLogIn: {
    path: "/auth/login",
  },
  authLogOut: {
    path: "/auth/logout",
  },
  admin: {
    path: "/admin",
  },
  adminProblem: {
    path: "/admin/problems/:slug",
    execute: ({ slug }: { slug: string }) =>
      `/admin/problems/${encodeURIComponent(slug)}`,
  },
  accountSetup: {
    path: "/account/setup",
  },
  dashboard: {
    path: "/",
  },
  problems: {
    path: "/problems",
  },
  problem: {
    path: "/problems/:slug",
    execute: ({ slug }: { slug: string }) =>
      `/problems/${encodeURIComponent(slug)}`,
  },
  createProblem: {
    path: "/admin/problems/create",
  },
  contests: {
    path: "/contests",
  },
  leaderboard: {
    path: "/leaderboard",
  },
  tutorials: {
    path: "/tutorials",
  },
  about: {
    path: "/about",
  },
  careers: {
    path: "/careers",
  },
  blog: {
    path: "/blog",
  },
  contact: {
    path: "/contact",
  },
  privacy: {
    path: "/privacy",
  },
  tags: {
    path: "/tags",
    execute: ({ tags }: { tags: string[] }) =>
      `/tags?q=${encodeURIComponent(tags.join(","))}`,
  },
  profile: {
    path: "/profile/:username",
    execute: ({ username }: { username: string }) =>
      `/profile/${encodeURIComponent(username)}`,
  },
  profileSettings: {
    path: "/settings",
  },

  settingsProfile: {
    path: "/settings/profile",
  },
  settingsAccount: {
    path: "/settings/account",
  },
  settingsPreferences: {
    path: "/settings/preferences",
  },
  terms: {
    path: "/terms",
  },
  cookies: {
    path: "/cookies",
  },
  dmca: {
    path: "/dmca",
  },
} as const satisfies Record<string, RouteEntry>;

export const routerConfig = Object.freeze(_routerConfig);
