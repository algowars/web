import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AuthCallback from "./auth-callback";
import { accountStore } from "@/features/account/account-store";
import { redirect } from "next/navigation";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/router-config", () => ({
  routerConfig: {
    accountSetup: { path: "/account/setup" },
    dashboard: { path: "/" },
    home: { path: "/" },
  },
}));

vi.mock("@/components/loader/page-loader/page-loader", () => ({
  default: ({ message }: { message: string }) => (
    <div data-testid="page-loader">{message}</div>
  ),
}));

describe("AuthCallback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    accountStore.setState({ account: null, isLoading: false });
  });

  it("shows page loader while still loading", () => {
    accountStore.setState({ account: null, isLoading: true });

    render(<AuthCallback />);

    expect(screen.getByTestId("page-loader")).toHaveTextContent(
      "Getting account information"
    );
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to account setup when account has no usernameLastChangedAt", () => {
    accountStore.setState({
      account: {
        id: "1",
        username: "user",
        createdAt: new Date(),
        updatedAt: null,
        usernameLastChangedAt: null,
        permissions: [],
      },
      isLoading: false,
    });

    render(<AuthCallback />);

    expect(redirect).toHaveBeenCalledWith("/account/setup");
  });

  it("redirects to dashboard when account is fully set up", () => {
    accountStore.setState({
      account: {
        id: "1",
        username: "user",
        createdAt: new Date(),
        updatedAt: null,
        usernameLastChangedAt: new Date(),
        permissions: [],
      },
      isLoading: false,
    });

    render(<AuthCallback />);

    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("redirects to home when account is null and not loading", () => {
    accountStore.setState({ account: null, isLoading: false });

    render(<AuthCallback />);

    expect(redirect).toHaveBeenCalledWith("/");
  });
});
