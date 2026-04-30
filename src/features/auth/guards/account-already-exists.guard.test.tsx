import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AccountAlreadyExistsGuard } from "./account-already-exists.guard";
import { accountStore } from "@/features/account/account-store";
import { redirect } from "next/navigation";

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
    accountStore.setState({ account: null, isLoading: false });
  });

  it("renders children when account is null", () => {
    render(
      <AccountAlreadyExistsGuard>
        <div>Protected Content</div>
      </AccountAlreadyExistsGuard>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("renders children when account has no username", () => {
    accountStore.setState({
      account: { id: "1", username: "", createdAt: new Date(), updatedAt: null, usernameLastChangedAt: null },
      isLoading: false,
    });

    render(
      <AccountAlreadyExistsGuard>
        <div>Protected Content</div>
      </AccountAlreadyExistsGuard>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to dashboard when account has a username", () => {
    accountStore.setState({
      account: { id: "1", username: "testuser", createdAt: new Date(), updatedAt: new Date(), usernameLastChangedAt: new Date() },
      isLoading: false,
    });

    render(
      <AccountAlreadyExistsGuard>
        <div>Protected Content</div>
      </AccountAlreadyExistsGuard>
    );

    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("redirects to custom route when specified", () => {
    accountStore.setState({
      account: { id: "1", username: "testuser", createdAt: new Date(), updatedAt: new Date(), usernameLastChangedAt: new Date() },
      isLoading: false,
    });

    render(
      <AccountAlreadyExistsGuard redirectRoute="/custom-route">
        <div>Protected Content</div>
      </AccountAlreadyExistsGuard>
    );

    expect(redirect).toHaveBeenCalledWith("/custom-route");
  });
});
