import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api-client", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("getProfileSettings", () => {
  it("returns null when accessToken is empty", async () => {
    const { getProfileSettings } = await import("./get-profile-settings");
    const result = await getProfileSettings({ accessToken: "" });
    expect(result).toBeNull();
  });

  it("calls api.get with the expected url and token", async () => {
    const { api } = await import("@/lib/api-client");
    (api.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      username: "alice",
    });

    const { getProfileSettings } = await import("./get-profile-settings");
    const result = await getProfileSettings({ accessToken: "token" });

    expect(api.get).toHaveBeenCalledWith({
      url: "/api/v1/account/find/settings/profile",
      accessToken: "token",
    });
    expect(result).toEqual({ username: "alice" });
  });
});
