import { describe, it, expect } from "vitest";
import { routerConfig } from "./router-config";

describe("routerConfig basic shape", () => {
  it("exports expected top-level route keys", () => {
    const keys = Object.keys(routerConfig);
    expect(keys).toEqual(
      expect.arrayContaining([
        "about",
        "accountSetup",
        "adminProblem",
        "authLogIn",
        "authLogOut",
        "authSignUp",
        "blog",
        "careers",
        "contact",
        "cookies",
        "contests",
        "createProblem",
        "dashboard",
        "dmca",
        "home",
        "leaderboard",
        "problem",
        "problemManagement",
        "problems",
        "profile",
        "profileSettings",
        "privacy",
        "settingsAccount",
        "settingsPreferences",
        "settingsProfile",
        "tags",
        "terms",
        "tutorials",
      ])
    );
  });

  it("every route has a string path", () => {
    for (const [, v] of Object.entries(routerConfig)) {
      expect(typeof v.path).toBe("string");
      expect(v.path.length).toBeGreaterThan(0);
    }
  });
});

describe("routerConfig execute functions", () => {
  it("adminProblem.execute encodes a slug", () => {
    const out = routerConfig.adminProblem.execute?.({ slug: "my test/slug?" });
    expect(out).toBe("/admin/problems/my%20test%2Fslug%3F");
  });

  it("problem.execute encodes a slug", () => {
    const out = routerConfig.problem.execute?.({ slug: "hello world" });
    expect(out).toBe("/problems/hello%20world");
  });

  it("tags.execute builds query with encoded comma-separated list", () => {
    const out = routerConfig.tags.execute?.({ tags: ["js", "ts & jsx"] });
    expect(out).toBe("/tags?q=js%2Cts%20%26%20jsx");
  });

  it("profile.execute encodes username", () => {
    const out = routerConfig.profile.execute?.({ username: "user/name" });
    expect(out).toBe("/profile/user%2Fname");
  });
});
