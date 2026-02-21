import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import AuthCallback from "./auth-callback";
import { useAccount, AuthStatus } from "../account.context";
import { redirect } from "next/navigation";
import { toast } from "sonner";

vi.mock("../account.context");

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
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
  });

  it("shows page loader when pending", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.UNAUTHENTICATED,
      isPending: true,
      error: null,
    });

    render(<AuthCallback />);

    expect(screen.getByTestId("page-loader")).toHaveTextContent(
      "Getting account information"
    );
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to account setup when PARTIALLY_AUTHENTICATED", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.PARTIALLY_AUTHENTICATED,
      isPending: false,
      error: null,
    });

    render(<AuthCallback />);

    expect(redirect).toHaveBeenCalledWith("/account/setup");
  });

  it("redirects to dashboard when FULLY_AUTHENTICATED", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.FULLY_AUTHENTICATED,
      isPending: false,
      error: null,
    });

    render(<AuthCallback />);

    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("shows toast and redirects to home when there is an error", () => {
    const mockError = { message: "Something went wrong" };
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.UNAUTHENTICATED,
      isPending: false,
      error: mockError,
    });

    render(<AuthCallback />);

    expect(toast.success).toHaveBeenCalledWith(
      "Error getting account information",
      {
        description: "Something went wrong",
      }
    );
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("redirects to home when UNAUTHENTICATED and no error", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.UNAUTHENTICATED,
      isPending: false,
      error: null,
    });

    render(<AuthCallback />);

    expect(redirect).toHaveBeenCalledWith("/");
  });
});
