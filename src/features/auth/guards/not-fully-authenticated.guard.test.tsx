import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AccountGuard } from "./not-fully-authenticated.guard";
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

describe("AccountGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    accountStore.setState({ account: null, isLoading: false });
  });

  it("renders children when account is null", () => {
    render(
      <AccountGuard>
        <div>Protected Content</div>
      </AccountGuard>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to dashboard and returns null when account exists", () => {
    accountStore.setState({
      account: {
        id: "123",
        username: "testuser",
        createdAt: new Date(),
        updatedAt: null,
        usernameLastChangedAt: null,
      },
      isLoading: false,
    });

    const { container } = render(
      <AccountGuard>
        <div>Protected Content</div>
      </AccountGuard>
    );

    expect(redirect).toHaveBeenCalledWith("/");
    expect(container.firstChild).toBeNull();
  });
});
