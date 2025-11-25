/* eslint-disable @typescript-eslint/no-explicit-any */

type RouteEntry = {
  path: string;
  execute?: (args: any) => string;
  asArray?: string[];
};

const _routerConfig = {
  about: { path: "/about" },
  accountSetup: { path: "/account/setup" },
  adminProblem: {
    path: "/admin/problems/:slug",
    execute: ({ slug }: { slug: string }) =>
      `/admin/problems/${encodeURIComponent(slug)}`,
  },
  blog: { path: "/blog" },
  careers: { path: "/careers" },
  cookies: { path: "/cookies" },
  contests: { path: "/contests" },
  createProblem: { path: "/problems/management/create" },
  dashboard: { path: "/" },
  dmca: { path: "/dmca" },
  home: { path: "/" },
  problem: {
    path: "/problems/:slug",
    execute: ({ slug }: { slug: string }) =>
      `/problems/${encodeURIComponent(slug)}`,
  },
  problemManagement: { path: "/problems/management" },
  problems: { path: "/problems" },
  profile: {
    path: "/profile/:username",
    execute: ({ username }: { username: string }) =>
      `/profile/${encodeURIComponent(username)}`,
  },
  profileSettings: { path: "/settings" },
  privacy: { path: "/privacy" },
  settingsAccount: { path: "/settings/account" },
  settingsPreferences: { path: "/settings/preferences" },
  settingsProfile: { path: "/settings/profile" },
  tags: {
    path: "/tags",
    execute: ({ tags }: { tags: string[] }) =>
      `/tags?q=${encodeURIComponent(tags.join(","))}`,
  },
  terms: { path: "/terms" },
  tutorials: { path: "/tutorials" },
  authLogIn: { path: "/auth/login?returnTo=/account/callback" },
  authLogOut: { path: "/auth/logout" },
  authSignUp: {
    path: "/auth/login?screen_hint=signup&returnTo=/account/callback",
  },
  leaderboard: { path: "/leaderboard" },
  contact: { path: "/contact" },
} as const satisfies Record<string, RouteEntry>;

export const routerConfig = Object.freeze(_routerConfig);
