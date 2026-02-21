import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { AuthComponentGuard } from "./auth-component.guard";
import { useAccount, AuthStatus } from "../account.context";

vi.mock("../account.context");

describe("AuthComponentGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows Loading text when isPending is true", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.UNAUTHENTICATED,
      isPending: true,
    });

    render(
      <AuthComponentGuard>
        <div>Authenticated Content</div>
      </AuthComponentGuard>
    );

    expect(screen.getByText("Loading")).toBeInTheDocument();
    expect(screen.queryByText("Authenticated Content")).not.toBeInTheDocument();
  });

  it("renders children when FULLY_AUTHENTICATED", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.FULLY_AUTHENTICATED,
      isPending: false,
    });

    render(
      <AuthComponentGuard>
        <div>Authenticated Content</div>
      </AuthComponentGuard>
    );

    expect(screen.getByText("Authenticated Content")).toBeInTheDocument();
  });

  it("renders partiallyAuthenticated content when PARTIALLY_AUTHENTICATED", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.PARTIALLY_AUTHENTICATED,
      isPending: false,
    });

    render(
      <AuthComponentGuard partiallyAuthenticated={<div>Partial Content</div>}>
        <div>Authenticated Content</div>
      </AuthComponentGuard>
    );

    expect(screen.getByText("Partial Content")).toBeInTheDocument();
    expect(screen.queryByText("Authenticated Content")).not.toBeInTheDocument();
  });

  it("renders unauthenticated content when UNAUTHENTICATED", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.UNAUTHENTICATED,
      isPending: false,
    });

    render(
      <AuthComponentGuard unauthenticated={<div>Login Required</div>}>
        <div>Authenticated Content</div>
      </AuthComponentGuard>
    );

    expect(screen.getByText("Login Required")).toBeInTheDocument();
    expect(screen.queryByText("Authenticated Content")).not.toBeInTheDocument();
  });

  it("renders null when PARTIALLY_AUTHENTICATED and no fallback provided", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.PARTIALLY_AUTHENTICATED,
      isPending: false,
    });

    const { container } = render(
      <AuthComponentGuard>
        <div>Authenticated Content</div>
      </AuthComponentGuard>
    );

    expect(screen.queryByText("Authenticated Content")).not.toBeInTheDocument();
    expect(container.textContent).toBe("");
  });

  it("renders null when UNAUTHENTICATED and no fallback provided", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.UNAUTHENTICATED,
      isPending: false,
    });

    const { container } = render(
      <AuthComponentGuard>
        <div>Authenticated Content</div>
      </AuthComponentGuard>
    );

    expect(screen.queryByText("Authenticated Content")).not.toBeInTheDocument();
    expect(container.textContent).toBe("");
  });
});
