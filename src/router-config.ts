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
  accountSetup: {
    path: "/account/setup",
  },
  problems: {
    path: "/problems",
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
