import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AppSidebar from "./app-sidebar";
import { accountStore } from "@/features/account/account-store";

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
  }: {
    children: React.ReactNode;
    asChild?: boolean;
    size?: string;
    disabled?: boolean;
  }) => <div data-testid="sidebar-menu-button">{children}</div>,
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
    <li data-testid="sidebar-menu-item">{children}</li>
  ),
}));

vi.mock("@/components/ui/command", () => ({
  Command: () => <span data-testid="command-icon" />,
}));

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
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
  }) => (
    <nav data-testid="sidebar-main-nav" data-title={title}>
      {items.length} items
    </nav>
  ),
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
  beforeEach(() => {
    accountStore.setState({ account: null, isLoading: false });
  });

  it("renders the sidebar", () => {
    render(<AppSidebar />);

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  it("renders sidebar header with Algowars branding", () => {
    render(<AppSidebar />);

    expect(screen.getByText("Algowars")).toBeInTheDocument();
    expect(screen.getByText("Competitive Coding")).toBeInTheDocument();
  });

  it("shows skeleton when loading", () => {
    accountStore.setState({ account: null, isLoading: true });

    render(<AppSidebar />);

    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("shows unauthenticated account when not logged in", () => {
    accountStore.setState({ account: null, isLoading: false });

    render(<AppSidebar />);

    expect(screen.getByTestId("unauthenticated-account")).toBeInTheDocument();
  });

  it("shows partially authenticated account when username not set", () => {
    accountStore.setState({
      account: {
        id: "1",
        username: "",
        createdAt: new Date(),
        updatedAt: null,
        usernameLastChangedAt: null,
      },
      isLoading: false,
    });

    render(<AppSidebar />);

    expect(
      screen.getByTestId("partially-authenticated-account")
    ).toBeInTheDocument();
  });

  it("shows app sidebar account when fully authenticated", () => {
    accountStore.setState({
      account: {
        id: "1",
        username: "testuser",
        createdAt: new Date(),
        updatedAt: new Date(),
        usernameLastChangedAt: new Date(),
      },
      isLoading: false,
    });

    render(<AppSidebar />);

    expect(screen.getByTestId("app-sidebar-account")).toBeInTheDocument();
  });

  it("shows Problem Management nav when user has ReadProblem permission", () => {
    accountStore.setState({
      account: {
        id: "1",
        username: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
        usernameLastChangedAt: new Date(),
        permissions: ["read:admin-problems" as never],
      },
      isLoading: false,
    });

    render(<AppSidebar />);

    const navs = screen.getAllByTestId("sidebar-main-nav");
    expect(navs).toHaveLength(2);
    expect(navs[1]).toHaveAttribute("data-title", "Problem Management");
  });

  it("hides Problem Management nav when user lacks ReadProblem permission", () => {
    accountStore.setState({
      account: {
        id: "1",
        username: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        usernameLastChangedAt: new Date(),
        permissions: [],
      },
      isLoading: false,
    });

    render(<AppSidebar />);

    const navs = screen.getAllByTestId("sidebar-main-nav");
    expect(navs).toHaveLength(1);
  });
});
