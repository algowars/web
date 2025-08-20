/* eslint-disable @typescript-eslint/no-explicit-any */

type RouteEntry = {
  path: string;
  execute?: (args: any) => string;
  asArray?: string[];
};

export const routerConfig = {
  home: {
    path: "/",
  },
  admin: {
    path: "/admin",
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
