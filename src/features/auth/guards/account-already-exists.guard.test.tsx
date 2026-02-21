import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { AccountAlreadyExistsGuard } from "./account-already-exists.guard";
import { useAccount, AuthStatus } from "../account.context";
import { redirect } from "next/navigation";

vi.mock("../account.context");

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/router-config", () => ({
  routerConfig: {
    dashboard: { path: "/" },
  },
}));

describe("AccountAlreadyExistsGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children when UNAUTHENTICATED", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.UNAUTHENTICATED,
    });

    render(
      <AccountAlreadyExistsGuard>
        <div>Protected Content</div>
      </AccountAlreadyExistsGuard>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("renders children when PARTIALLY_AUTHENTICATED", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.PARTIALLY_AUTHENTICATED,
    });

    render(
      <AccountAlreadyExistsGuard>
        <div>Protected Content</div>
      </AccountAlreadyExistsGuard>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to dashboard when FULLY_AUTHENTICATED", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.FULLY_AUTHENTICATED,
    });

    render(
      <AccountAlreadyExistsGuard>
        <div>Protected Content</div>
      </AccountAlreadyExistsGuard>
    );

    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("redirects to custom route when specified", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.FULLY_AUTHENTICATED,
    });

    render(
      <AccountAlreadyExistsGuard redirectRoute="/custom-route">
        <div>Protected Content</div>
      </AccountAlreadyExistsGuard>
    );

    expect(redirect).toHaveBeenCalledWith("/custom-route");
  });
});
