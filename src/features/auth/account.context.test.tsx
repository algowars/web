import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { AccountProvider, useAccount, AuthStatus } from "./account.context";
import { useUser, getAccessToken } from "@auth0/nextjs-auth0";
import { useAccount as useAccountQuery } from "./api/get-account";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@auth0/nextjs-auth0", () => ({
  useUser: vi.fn(),
  getAccessToken: vi.fn(),
}));

vi.mock("./api/get-account", () => ({
  useAccount: vi.fn(),
}));

function TestConsumer() {
  const context = useAccount();
  return (
    <div>
      <span data-testid="auth-status">{context.authStatus}</span>
      <span data-testid="is-pending">{context.isPending.toString()}</span>
      <span data-testid="is-authenticated">
        {context.isAuthenticated.toString()}
      </span>
      <span data-testid="error">{context.error?.message ?? "no error"}</span>
    </div>
  );
}

function renderWithProvider() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AccountProvider>
        <TestConsumer />
      </AccountProvider>
    </QueryClientProvider>
  );
}

describe("AccountProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("provides UNAUTHENTICATED status when no user", () => {
    (useUser as Mock).mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
    });
    (useAccountQuery as Mock).mockReturnValue({
      data: null,
      isPending: false,
      error: null,
      status: "success",
      refetch: vi.fn(),
    });
    (getAccessToken as Mock).mockResolvedValue(null);

    renderWithProvider();

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      AuthStatus.UNAUTHENTICATED
    );
  });

  it("provides PARTIALLY_AUTHENTICATED status when user but no account", () => {
    (useUser as Mock).mockReturnValue({
      user: { sub: "user-123" },
      isLoading: false,
      error: null,
    });
    (useAccountQuery as Mock).mockReturnValue({
      data: null,
      isPending: false,
      error: null,
      status: "success",
      refetch: vi.fn(),
    });
    (getAccessToken as Mock).mockResolvedValue("mock-token");

    renderWithProvider();

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      AuthStatus.PARTIALLY_AUTHENTICATED
    );
  });

  it("provides FULLY_AUTHENTICATED status when user and account exist", () => {
    (useUser as Mock).mockReturnValue({
      user: { sub: "user-123" },
      isLoading: false,
      error: null,
    });
    (useAccountQuery as Mock).mockReturnValue({
      data: { id: "account-123", username: "testuser" },
      isPending: false,
      error: null,
      status: "success",
      refetch: vi.fn(),
    });
    (getAccessToken as Mock).mockResolvedValue("mock-token");

    renderWithProvider();

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      AuthStatus.FULLY_AUTHENTICATED
    );
    expect(screen.getByTestId("is-authenticated")).toHaveTextContent("true");
  });

  it("shows isPending true when auth is loading", () => {
    (useUser as Mock).mockReturnValue({
      user: null,
      isLoading: true,
      error: null,
    });
    (useAccountQuery as Mock).mockReturnValue({
      data: null,
      isPending: false,
      error: null,
      status: "success",
      refetch: vi.fn(),
    });
    (getAccessToken as Mock).mockResolvedValue(null);

    renderWithProvider();

    expect(screen.getByTestId("is-pending")).toHaveTextContent("true");
  });

  it("shows isPending true when account query is pending", () => {
    (useUser as Mock).mockReturnValue({
      user: { sub: "user-123" },
      isLoading: false,
      error: null,
    });
    (useAccountQuery as Mock).mockReturnValue({
      data: null,
      isPending: true,
      error: null,
      status: "pending",
      refetch: vi.fn(),
    });
    (getAccessToken as Mock).mockResolvedValue("mock-token");

    renderWithProvider();

    expect(screen.getByTestId("is-pending")).toHaveTextContent("true");
  });

  it("shows error from account query", () => {
    (useUser as Mock).mockReturnValue({
      user: { sub: "user-123" },
      isLoading: false,
      error: null,
    });
    (useAccountQuery as Mock).mockReturnValue({
      data: null,
      isPending: false,
      error: new Error("Account error"),
      status: "error",
      refetch: vi.fn(),
    });
    (getAccessToken as Mock).mockResolvedValue("mock-token");

    renderWithProvider();

    expect(screen.getByTestId("error")).toHaveTextContent("Account error");
  });

  it("shows error from auth0", () => {
    (useUser as Mock).mockReturnValue({
      user: null,
      isLoading: false,
      error: new Error("Auth0 error"),
    });
    (useAccountQuery as Mock).mockReturnValue({
      data: null,
      isPending: false,
      error: null,
      status: "success",
      refetch: vi.fn(),
    });
    (getAccessToken as Mock).mockResolvedValue(null);

    renderWithProvider();

    expect(screen.getByTestId("error")).toHaveTextContent("Auth0 error");
  });
});

describe("useAccount", () => {
  it("throws error when used outside AccountProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      "useAccount must be used within an AccountProvider"
    );

    consoleError.mockRestore();
  });
});
