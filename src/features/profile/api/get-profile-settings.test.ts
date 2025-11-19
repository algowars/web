import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import {
  getProfileSettings,
  useProfileSettings,
} from "./get-profile-settings";

vi.mock("@/lib/api-client", () => ({
  api: {
    get: vi.fn(),
  },
}));

const mockedApiGet = vi.mocked(api.get);

describe("getProfileSettings", () => {
  it("requests profile settings from the API", async () => {
    mockedApiGet.mockResolvedValue({ username: "mock-user" });

    const result = await getProfileSettings();

    expect(mockedApiGet).toHaveBeenCalledWith({
      url: "/api/account/settings/profile",
    });
    expect(result).toEqual({ username: "mock-user" });
  });
});

describe("useProfileSettings", () => {
  it("returns data from the profile settings query", async () => {
    mockedApiGet.mockResolvedValue({ username: "mock-user" });
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useProfileSettings(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual({ username: "mock-user" });
    });
  });
});
