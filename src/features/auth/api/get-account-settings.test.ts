import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import {
  getAccountSettings,
  getAccountSettingsQueryOptions,
} from "./get-account-settings";
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

  it("calls api.get with correct url", async () => {
    const mockSettings = { theme: "dark", notifications: true };
    (api.get as Mock).mockResolvedValue(mockSettings);

    const result = await getAccountSettings();

    expect(api.get).toHaveBeenCalledWith({
      url: "/api/v1/account/find/settings",
    });
    expect(result).toEqual(mockSettings);
  });
});

describe("getAccountSettingsQueryOptions", () => {
  it("returns query options with correct queryKey", () => {
    const options = getAccountSettingsQueryOptions();

    expect(options.queryKey).toEqual(["account-settings"]);
  });

  it("returns query options with queryFn", () => {
    const options = getAccountSettingsQueryOptions();

    expect(options.queryFn).toBeDefined();
    expect(typeof options.queryFn).toBe("function");
  });
});
