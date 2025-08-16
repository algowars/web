import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, afterEach, describe, it, expect } from "vitest";
import { AccountProvider, AuthStatus, useAccount } from "./account.context";
import { setAuth0State, setAuthenticatedUser } from "@/test-utils/auth0-mock";
const useAccountQueryMock = vi.fn();

vi.mock("./api/get-account", () => ({
  useAccount: (...args: any[]) => useAccountQueryMock(...args),
}));

function TestConsumer() {
  const ctx = useAccount();
  return (
    <div>
      <div data-testid="auth-status">{ctx.authStatus}</div>
      <div data-testid="is-authenticated">{String(ctx.isAuthenticated)}</div>
      <div data-testid="is-loading">{String(ctx.isLoading)}</div>
      <button onClick={ctx.refreshAccount}>refresh</button>
      <button onClick={ctx.logout}>logout</button>
    </div>
  );
}

const renderWithProvider = () =>
  render(
    <AccountProvider>
      <TestConsumer />
    </AccountProvider>
  );

afterEach(() => {
  vi.clearAllMocks();
});

describe("AccountProvider auth status logic", () => {
  it("UNAUTHENTICATED when auth0 not authenticated", () => {
    setAuth0State({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
    useAccountQueryMock.mockReturnValue({
      data: null,
      isLoading: false,
      isPending: false,
      error: null,
      status: "success",
      refetch: vi.fn(),
    });

    renderWithProvider();
    expect(screen.getByTestId("auth-status").textContent).toBe(
      AuthStatus.UNAUTHENTICATED
    );
    expect(screen.getByTestId("is-authenticated").textContent).toBe("false");
  });

  it("PARTIALLY_AUTHENTICATED when auth0 authenticated but no account", () => {
    setAuthenticatedUser({ sub: "u1", name: "Alice" });
    setAuth0State({ isAuthenticated: true, isLoading: false });
    useAccountQueryMock.mockReturnValue({
      data: null,
      isLoading: false,
      isPending: false,
      error: null,
      status: "success",
      refetch: vi.fn(),
    });

    renderWithProvider();
    expect(screen.getByTestId("auth-status").textContent).toBe(
      AuthStatus.PARTIALLY_AUTHENTICATED
    );
    expect(screen.getByTestId("is-authenticated").textContent).toBe("false");
  });

  it("FULLY_AUTHENTICATED when auth0 authenticated and account present", () => {
    setAuthenticatedUser({ sub: "u2", name: "Bob" });
    setAuth0State({ isAuthenticated: true, isLoading: false });
    useAccountQueryMock.mockReturnValue({
      data: { id: "acc1" },
      isLoading: false,
      isPending: false,
      error: null,
      status: "success",
      refetch: vi.fn(),
    });

    renderWithProvider();
    expect(screen.getByTestId("auth-status").textContent).toBe(
      AuthStatus.FULLY_AUTHENTICATED
    );
    expect(screen.getByTestId("is-authenticated").textContent).toBe("true");
  });

  it("isLoading true when either auth0 or account query loading", () => {
    setAuth0State({ isAuthenticated: true, isLoading: true });
    useAccountQueryMock.mockReturnValue({
      data: null,
      isLoading: false,
      isPending: false,
      error: null,
      status: "pending",
      refetch: vi.fn(),
    });

    renderWithProvider();
    expect(screen.getByTestId("is-loading").textContent).toBe("true");
  });
});

describe("refreshAccount & logout", () => {
  it("calls refetch on refreshAccount", () => {
    const refetchSpy = vi.fn();
    setAuthenticatedUser();
    setAuth0State({ isAuthenticated: true, isLoading: false });
    useAccountQueryMock.mockReturnValue({
      data: null,
      isLoading: false,
      isPending: false,
      error: null,
      status: "success",
      refetch: refetchSpy,
    });

    renderWithProvider();
    fireEvent.click(screen.getByText("refresh"));
    expect(refetchSpy).toHaveBeenCalledTimes(1);
  });

  it("calls auth0 logout with returnTo origin", () => {
    const logoutSpy = vi.fn();
    setAuthenticatedUser();
    setAuth0State({
      isAuthenticated: true,
      isLoading: false,
      logout: logoutSpy,
    } as any);

    useAccountQueryMock.mockReturnValue({
      data: { id: "acc1" },
      isLoading: false,
      isPending: false,
      error: null,
      status: "success",
      refetch: vi.fn(),
    });

    renderWithProvider();
    fireEvent.click(screen.getByText("logout"));
    expect(logoutSpy).toHaveBeenCalledTimes(1);
    expect(logoutSpy.mock.calls[0][0]).toMatchObject({
      logoutParams: { returnTo: window.location.origin },
    });
  });
});
