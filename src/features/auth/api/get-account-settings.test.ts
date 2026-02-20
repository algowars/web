import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { getAccountSettings, getAccountSettingsQueryOptions } from "./get-account-settings";
import { api } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("getAccountSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when accessToken is empty", async () => {
    const result = await getAccountSettings({ accessToken: "" });

    expect(result).toBeNull();
    expect(api.get).not.toHaveBeenCalled();
  });

  it("calls api.get with correct parameters when accessToken provided", async () => {
    const mockSettings = { theme: "dark", notifications: true };
    (api.get as Mock).mockResolvedValue(mockSettings);

    const result = await getAccountSettings({ accessToken: "valid-token" });

    expect(api.get).toHaveBeenCalledWith({
      url: "/api/v1/account/find/settings",
      accessToken: "valid-token",
    });
    expect(result).toEqual(mockSettings);
  });
});

describe("getAccountSettingsQueryOptions", () => {
  it("returns query options with correct queryKey", () => {
    const options = getAccountSettingsQueryOptions("test-token");

    expect(options.queryKey).toEqual(["account", "test-token"]);
  });

  it("returns query options with queryFn", () => {
    const options = getAccountSettingsQueryOptions("test-token");

    expect(options.queryFn).toBeDefined();
    expect(typeof options.queryFn).toBe("function");
  });
});
