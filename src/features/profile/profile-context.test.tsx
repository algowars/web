import { render, screen, renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { ProfileProvider, useProfileContext } from "./profile-context";
import { useProfile } from "./api/get-profile";
import { ProfileAggregate } from "./models/profile-aggregate";

vi.mock("./api/get-profile");

const mockProfileAggregate: ProfileAggregate = {
  profile: {
    username: "testuser",
    imageUrl: "https://example.com/avatar.png",
    createdOn: new Date("2024-01-01"),
  },
};

describe("ProfileContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ProfileProvider", () => {
    it("renders children", () => {
      (useProfile as Mock).mockReturnValue({
        data: mockProfileAggregate,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
        refetch: vi.fn(),
      });

      render(
        <ProfileProvider username="testuser">
          <div data-testid="child">Child Content</div>
        </ProfileProvider>
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("provides loading state when isLoading is true", () => {
      (useProfile as Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
        isFetching: false,
        isError: false,
        error: undefined,
        refetch: vi.fn(),
      });

      const TestComponent = () => {
        const ctx = useProfileContext();
        return (
          <div>
            <span data-testid="isPending">{String(ctx.isPending)}</span>
            <span data-testid="isLoading">{String(ctx.isLoading)}</span>
          </div>
        );
      };

      render(
        <ProfileProvider username="testuser">
          <TestComponent />
        </ProfileProvider>
      );

      expect(screen.getByTestId("isPending").textContent).toBe("true");
      expect(screen.getByTestId("isLoading").textContent).toBe("true");
    });

    it("provides loading state when isFetching is true", () => {
      (useProfile as Mock).mockReturnValue({
        data: mockProfileAggregate,
        isLoading: false,
        isFetching: true,
        isError: false,
        error: undefined,
        refetch: vi.fn(),
      });

      const TestComponent = () => {
        const ctx = useProfileContext();
        return (
          <div>
            <span data-testid="isPending">{String(ctx.isPending)}</span>
            <span data-testid="isFetching">{String(ctx.isFetching)}</span>
          </div>
        );
      };

      render(
        <ProfileProvider username="testuser">
          <TestComponent />
        </ProfileProvider>
      );

      expect(screen.getByTestId("isPending").textContent).toBe("true");
      expect(screen.getByTestId("isFetching").textContent).toBe("true");
    });

    it("provides profile data when loaded", () => {
      (useProfile as Mock).mockReturnValue({
        data: mockProfileAggregate,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
        refetch: vi.fn(),
      });

      const TestComponent = () => {
        const ctx = useProfileContext();
        return (
          <div>
            <span data-testid="username">{ctx.username}</span>
            <span data-testid="profileUsername">
              {ctx.profileAggregate?.profile.username}
            </span>
          </div>
        );
      };

      render(
        <ProfileProvider username="testuser">
          <TestComponent />
        </ProfileProvider>
      );

      expect(screen.getByTestId("username").textContent).toBe("testuser");
      expect(screen.getByTestId("profileUsername").textContent).toBe(
        "testuser"
      );
    });

    it("provides null profileAggregate when data is undefined", () => {
      (useProfile as Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
        isFetching: false,
        isError: false,
        error: undefined,
        refetch: vi.fn(),
      });

      const TestComponent = () => {
        const ctx = useProfileContext();
        return (
          <span data-testid="profileAggregate">
            {ctx.profileAggregate === null ? "null" : "not-null"}
          </span>
        );
      };

      render(
        <ProfileProvider username="testuser">
          <TestComponent />
        </ProfileProvider>
      );

      expect(screen.getByTestId("profileAggregate").textContent).toBe("null");
    });

    it("provides error state when isError is true", () => {
      const mockError = new Error("Failed to fetch profile");
      (useProfile as Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: true,
        error: mockError,
        refetch: vi.fn(),
      });

      const TestComponent = () => {
        const ctx = useProfileContext();
        return (
          <div>
            <span data-testid="isError">{String(ctx.isError)}</span>
            <span data-testid="error">
              {ctx.error instanceof Error ? ctx.error.message : "no error"}
            </span>
          </div>
        );
      };

      render(
        <ProfileProvider username="testuser">
          <TestComponent />
        </ProfileProvider>
      );

      expect(screen.getByTestId("isError").textContent).toBe("true");
      expect(screen.getByTestId("error").textContent).toBe(
        "Failed to fetch profile"
      );
    });

    it("calls useProfile with correct username", () => {
      (useProfile as Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
        isFetching: false,
        isError: false,
        error: undefined,
        refetch: vi.fn(),
      });

      render(
        <ProfileProvider username="differentuser">
          <div>Child</div>
        </ProfileProvider>
      );

      expect(useProfile).toHaveBeenCalledWith({ username: "differentuser" });
    });

    it("provides refetch function that calls underlying refetch", async () => {
      const mockRefetch = vi
        .fn()
        .mockResolvedValue({ data: mockProfileAggregate });
      (useProfile as Mock).mockReturnValue({
        data: mockProfileAggregate,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
        refetch: mockRefetch,
      });

      let capturedRefetch: (() => Promise<unknown>) | undefined;
      const TestComponent = () => {
        const ctx = useProfileContext();
        capturedRefetch = ctx.refetch;
        return <div>Child</div>;
      };

      render(
        <ProfileProvider username="testuser">
          <TestComponent />
        </ProfileProvider>
      );

      expect(capturedRefetch).toBeDefined();
      await capturedRefetch!();
      expect(mockRefetch).toHaveBeenCalled();
    });

    it("refetch rejects when underlying refetch throws", async () => {
      const mockError = new Error("Refetch failed");
      const mockRefetch = vi.fn().mockRejectedValue(mockError);
      (useProfile as Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
        refetch: mockRefetch,
      });

      let capturedRefetch: (() => Promise<unknown>) | undefined;
      const TestComponent = () => {
        const ctx = useProfileContext();
        capturedRefetch = ctx.refetch;
        return <div>Child</div>;
      };

      render(
        <ProfileProvider username="testuser">
          <TestComponent />
        </ProfileProvider>
      );

      expect(capturedRefetch).toBeDefined();
      await expect(capturedRefetch!()).rejects.toThrow("Refetch failed");
    });
  });

  describe("useProfileContext", () => {
    it("throws error when used outside ProfileProvider", () => {
      expect(() => {
        renderHook(() => useProfileContext());
      }).toThrow("useProfileContext must be used within a ProfileProvider");
    });

    it("returns context value when used within ProfileProvider", () => {
      (useProfile as Mock).mockReturnValue({
        data: mockProfileAggregate,
        isLoading: false,
        isFetching: false,
        isError: false,
        error: undefined,
        refetch: vi.fn(),
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ProfileProvider username="testuser">{children}</ProfileProvider>
      );

      const { result } = renderHook(() => useProfileContext(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.username).toBe("testuser");
      expect(result.current.profileAggregate).toEqual(mockProfileAggregate);
      expect(result.current.isPending).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(typeof result.current.refetch).toBe("function");
    });
  });
});
