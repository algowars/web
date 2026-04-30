import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AuthCallback from "./auth-callback";
import { accountStore } from "@/features/account/account-store";
import { redirect } from "next/navigation";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/router-config", () => ({
  routerConfig: {
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

  it("shows page loader when account is null", () => {
    const { getByTestId } = render(<AuthCallback />);

    expect(getByTestId("page-loader")).toHaveTextContent(
      "Getting account information"
    );
  });

  it("redirects to dashboard when account exists", () => {
    accountStore.setState({
      account: {
        id: "1",
        username: "testuser",
        createdAt: new Date(),
        updatedAt: null,
        usernameLastChangedAt: null,
      },
      isLoading: false,
    });

    render(<AuthCallback />);

    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("redirects to home when account is null", () => {
    accountStore.setState({ account: null, isLoading: false });

    render(<AuthCallback />);

    expect(redirect).toHaveBeenCalledWith("/");
  });
});
