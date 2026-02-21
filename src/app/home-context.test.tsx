import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import HomeContext from "./home-context";
import { AuthStatus, useAccount } from "@/features/auth/account.context";

vi.mock("@/features/auth/account.context", () => ({
  AuthStatus: {
    FULLY_AUTHENTICATED: "FULLY_AUTHENTICATED",
    UNAUTHENTICATED: "UNAUTHENTICATED",
  },
  useAccount: vi.fn(),
}));

vi.mock("@/components/loader/page-loader/page-loader", () => ({
  default: ({ message }: { message: string }) => (
    <div data-testid="page-loader">{message}</div>
  ),
}));

vi.mock("@/features/dashboard/dashboard", () => ({
  default: () => <div data-testid="dashboard">Dashboard</div>,
}));

vi.mock("@/features/landing/landing", () => ({
  default: () => <div data-testid="landing">Landing</div>,
}));

describe("HomeContext", () => {
  it("shows PageLoader when pending", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.UNAUTHENTICATED,
      isPending: true,
    });

    render(<HomeContext />);

    expect(screen.getByTestId("page-loader")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows Dashboard when fully authenticated", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.FULLY_AUTHENTICATED,
      isPending: false,
    });

    render(<HomeContext />);

    expect(screen.getByTestId("dashboard")).toBeInTheDocument();
  });

  it("shows Landing when not authenticated", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.UNAUTHENTICATED,
      isPending: false,
    });

    render(<HomeContext />);

    expect(screen.getByTestId("landing")).toBeInTheDocument();
  });
});
