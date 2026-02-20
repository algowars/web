import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import AppSidebar from "./app-sidebar";
import { useAccount } from "@/features/auth/account.context";

vi.mock("@/features/auth/account.context", () => ({
  useAccount: vi.fn(),
}));

vi.mock("@/components/ui/sidebar", () => ({
  Sidebar: ({ children, ...props }: { children: React.ReactNode }) => (
    <aside data-testid="sidebar" {...props}>
      {children}
    </aside>
  ),
  SidebarContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-content">{children}</div>
  ),
  SidebarFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-footer">{children}</div>
  ),
  SidebarHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-header">{children}</div>
  ),
  SidebarMenu: ({ children }: { children: React.ReactNode }) => (
    <ul data-testid="sidebar-menu">{children}</ul>
  ),
  SidebarMenuButton: ({
    children,
    asChild,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
    size?: string;
  }) => <div data-testid="sidebar-menu-button">{children}</div>,
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
    <li data-testid="sidebar-menu-item">{children}</li>
  ),
}));

vi.mock("@/components/ui/command", () => ({
  Command: () => <span data-testid="command-icon" />,
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("./sidebar-main-nav", () => ({
  SidebarMainNav: ({
    items,
    title = "Platform",
  }: {
    items: unknown[];
    title?: string;
  }) => <nav data-testid="sidebar-main-nav" data-title={title}>{items.length} items</nav>,
}));

vi.mock("@/features/auth/guards/auth-component.guard", () => ({
  AuthComponentGuard: ({
    children,
    unauthenticated,
    partiallyAuthenticated,
  }: {
    children: React.ReactNode;
    unauthenticated: React.ReactNode;
    partiallyAuthenticated: React.ReactNode;
  }) => <div data-testid="auth-guard">{children}</div>,
}));

vi.mock("./unauthenticated-account", () => ({
  UnauthenticatedAccount: () => <div data-testid="unauthenticated-account" />,
}));

vi.mock("./partially-authenticated-account", () => ({
  PartiallyAuthenticatedAccount: () => (
    <div data-testid="partially-authenticated-account" />
  ),
}));

vi.mock("./app-sidebar-account", () => ({
  AppSidebarAccount: () => <div data-testid="app-sidebar-account" />,
}));

describe("AppSidebar", () => {
  it("renders the sidebar", () => {
    (useAccount as Mock).mockReturnValue({
      isAuthenticated: false,
      account: null,
    });

    render(<AppSidebar />);

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  it("renders sidebar header with Algowars branding", () => {
    (useAccount as Mock).mockReturnValue({
      isAuthenticated: false,
      account: null,
    });

    render(<AppSidebar />);

    expect(screen.getByText("Algowars")).toBeInTheDocument();
    expect(screen.getByText("Competitive Coding")).toBeInTheDocument();
  });

  it("shows Home title when not authenticated", () => {
    (useAccount as Mock).mockReturnValue({
      isAuthenticated: false,
      account: null,
    });

    render(<AppSidebar />);

    const navs = screen.getAllByTestId("sidebar-main-nav");
    expect(navs[0]).toHaveAttribute("data-title", "Platform");
  });

  it("renders sidebar footer with auth guard", () => {
    (useAccount as Mock).mockReturnValue({
      isAuthenticated: true,
      account: { username: "testuser" },
    });

    render(<AppSidebar />);

    expect(screen.getByTestId("auth-guard")).toBeInTheDocument();
    expect(screen.getByTestId("app-sidebar-account")).toBeInTheDocument();
  });

  it("shows Problem Management nav when user has ReadProblem permission", () => {
    (useAccount as Mock).mockReturnValue({
      isAuthenticated: true,
      account: { username: "admin", permissions: ["read:admin-problems"] },
    });

    render(<AppSidebar />);

    const navs = screen.getAllByTestId("sidebar-main-nav");
    expect(navs).toHaveLength(2);
    expect(navs[1]).toHaveAttribute("data-title", "Problem Management");
  });

  it("hides Problem Management nav when user lacks ReadProblem permission", () => {
    (useAccount as Mock).mockReturnValue({
      isAuthenticated: true,
      account: { username: "user", permissions: [] },
    });

    render(<AppSidebar />);

    const navs = screen.getAllByTestId("sidebar-main-nav");
    expect(navs).toHaveLength(1);
  });
});
