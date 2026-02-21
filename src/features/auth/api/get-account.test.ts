import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { getAccount, getAccountQueryOptions } from "./get-account";
import { api } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("getAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when accessToken is empty", async () => {
    const result = await getAccount({ accessToken: "" });

    expect(result).toBeNull();
    expect(api.get).not.toHaveBeenCalled();
  });

  it("calls api.get with correct parameters when accessToken provided", async () => {
    const mockAccount = { id: "123", username: "testuser" };
    (api.get as Mock).mockResolvedValue(mockAccount);

    const result = await getAccount({ accessToken: "valid-token" });

    expect(api.get).toHaveBeenCalledWith({
      url: "/api/v1/account/find/profile",
      accessToken: "valid-token",
    });
    expect(result).toEqual(mockAccount);
  });
});

describe("getAccountQueryOptions", () => {
  it("returns query options with correct queryKey", () => {
    const options = getAccountQueryOptions("test-token");

    expect(options.queryKey).toEqual(["account", "test-token"]);
  });

  it("returns query options with queryFn", () => {
    const options = getAccountQueryOptions("test-token");

    expect(options.queryFn).toBeDefined();
    expect(typeof options.queryFn).toBe("function");
  });
});
