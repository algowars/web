import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { AccountGuard } from "./not-fully-authenticated.guard";
import { useAccount } from "../account.context";
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

describe("AccountGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children when account is falsy", () => {
    (useAccount as Mock).mockReturnValue(null);

    render(
      <AccountGuard>
        <div>Protected Content</div>
      </AccountGuard>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("renders children when account is undefined", () => {
    (useAccount as Mock).mockReturnValue(undefined);

    render(
      <AccountGuard>
        <div>Protected Content</div>
      </AccountGuard>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to dashboard and returns null when account exists", () => {
    (useAccount as Mock).mockReturnValue({
      id: "123",
      name: "Test User",
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
