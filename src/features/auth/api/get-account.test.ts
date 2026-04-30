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

  it("calls api.get with correct url", async () => {
    const mockAccount = { id: "123", username: "testuser" };
    (api.get as Mock).mockResolvedValue(mockAccount);

    const result = await getAccount();

    expect(api.get).toHaveBeenCalledWith({
      url: "/api/v1/account/find/profile",
    });
    expect(result).toEqual(mockAccount);
  });
});

describe("getAccountQueryOptions", () => {
  it("returns query options with correct queryKey", () => {
    const options = getAccountQueryOptions();

    expect(options.queryKey).toEqual(["account"]);
  });

  it("returns query options with queryFn", () => {
    const options = getAccountQueryOptions();

    expect(options.queryFn).toBeDefined();
    expect(typeof options.queryFn).toBe("function");
  });
});
