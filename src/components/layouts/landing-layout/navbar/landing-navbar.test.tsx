import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import LandingNavbar from "./landing-navbar";
import { useAccount, AuthStatus } from "@/features/auth/account.context";

vi.mock("@/features/auth/account.context");

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("@/components/logos/app-logo", () => ({
  default: () => <span data-testid="app-logo">AppLogo</span>,
}));

vi.mock("@/components/theme/mode-toggle", () => ({
  ModeToggle: () => <button data-testid="mode-toggle">Theme</button>,
}));

vi.mock("@/features/auth/auth-login/auth-login-button", () => ({
  default: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href="/login" className={className}>
      {children}
    </a>
  ),
}));

vi.mock("@/features/auth/auth-signup/auth-signup-button", () => ({
  default: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href="/signup" className={className}>
      {children}
    </a>
  ),
}));

vi.mock("@/features/auth/auth-logout/auth-logout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <a href="/logout">{children}</a>
  ),
}));

vi.mock("@/router-config", () => ({
  routerConfig: {
    home: { path: "/" },
    problems: { path: "/problems" },
    profile: {
      execute: ({ username }: { username: string }) => `/profile/${username}`,
    },
  },
}));

describe("LandingNavbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders navigation", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.UNAUTHENTICATED,
      account: null,
    });

    render(<LandingNavbar />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders AppLogo", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.UNAUTHENTICATED,
      account: null,
    });

    render(<LandingNavbar />);

    expect(screen.getByTestId("app-logo")).toBeInTheDocument();
  });

  it("renders mode toggle", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.UNAUTHENTICATED,
      account: null,
    });

    render(<LandingNavbar />);

    expect(screen.getByTestId("mode-toggle")).toBeInTheDocument();
  });

  it("renders Home link", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.UNAUTHENTICATED,
      account: null,
    });

    render(<LandingNavbar />);

    expect(screen.getAllByText("Home").length).toBeGreaterThanOrEqual(1);
  });

  it("renders Problems link", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.UNAUTHENTICATED,
      account: null,
    });

    render(<LandingNavbar />);

    expect(screen.getAllByText("Problems").length).toBeGreaterThanOrEqual(1);
  });

  it("shows Sign In and Sign Up for unauthenticated users", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.UNAUTHENTICATED,
      account: null,
    });

    render(<LandingNavbar />);

    expect(screen.getAllByText("Sign In").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Sign Up").length).toBeGreaterThanOrEqual(1);
  });

  it("shows user avatar for fully authenticated users", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.FULLY_AUTHENTICATED,
      account: {
        username: "testuser",
        imageUrl: "https://example.com/avatar.jpg",
      },
    });

    render(<LandingNavbar />);

    expect(screen.getByText("TE")).toBeInTheDocument();
  });

  it("shows User fallback when account has no username", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.PARTIALLY_AUTHENTICATED,
      account: null,
    });

    render(<LandingNavbar />);

    expect(screen.getByText("US")).toBeInTheDocument();
  });
});
