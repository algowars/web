import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { AppSidebarAccount } from "./app-sidebar-account";
import { accountStore } from "@/features/account/account-store";
import { useSidebar } from "@/components/ui/sidebar";

vi.mock("@/features/account/account-store", () => ({
  accountStore: vi.fn(),
}));

vi.mock("@/components/ui/sidebar", () => ({
  SidebarMenu: ({ children }: { children: React.ReactNode }) => (
    <ul data-testid="sidebar-menu">{children}</ul>
  ),
  SidebarMenuButton: ({
    children,
    size,
  }: {
    children: React.ReactNode;
    size?: string;
    className?: string;
  }) => (
    <button data-testid="sidebar-menu-button" data-size={size}>
      {children}
    </button>
  ),
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
    <li data-testid="sidebar-menu-item">{children}</li>
  ),
  useSidebar: vi.fn(),
}));

vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children }: { children: React.ReactNode; className?: string }) => (
    <span data-testid="avatar">{children}</span>
  ),
  AvatarFallback: ({
    children,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <span data-testid="avatar-fallback">{children}</span>,
  AvatarImage: ({ src, alt }: { src?: string; alt?: string }) => (
    <img data-testid="avatar-image" src={src} alt={alt} />
  ),
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuContent: ({
    children,
    side,
    align,
  }: {
    children: React.ReactNode;
    side?: string;
    align?: string;
  }) => (
    <div data-testid="dropdown-content" data-side={side}>
      {children}
    </div>
  ),
  DropdownMenuGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-group">{children}</div>
  ),
  DropdownMenuItem: ({
    children,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => <div data-testid="dropdown-item">{children}</div>,
  DropdownMenuLabel: ({
    children,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div data-testid="dropdown-label">{children}</div>,
  DropdownMenuSeparator: () => <hr data-testid="dropdown-separator" />,
  DropdownMenuTrigger: ({
    children,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => <div data-testid="dropdown-trigger">{children}</div>,
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

vi.mock("@/features/auth/auth-logout/auth-logout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="auth-logout">{children}</button>
  ),
}));

describe("AppSidebarAccount", () => {
  const mockAccount = (account: Record<string, unknown> | null) => {
    (accountStore as unknown as Mock).mockImplementation(
      (selector: (state: { account: typeof account }) => unknown) =>
        selector({ account })
    );
  };

  beforeEach(() => {
    (useSidebar as Mock).mockReturnValue({ isMobile: false });
  });

  it("renders account menu", () => {
    mockAccount({ username: "testuser", imageUrl: "https://example.com/avatar.jpg" });

    render(<AppSidebarAccount />);

    expect(screen.getByTestId("sidebar-menu")).toBeInTheDocument();
  });

  it("displays username", () => {
    mockAccount({ username: "testuser", imageUrl: "" });

    render(<AppSidebarAccount />);

    expect(screen.getAllByText("testuser").length).toBeGreaterThanOrEqual(1);
  });

  it("renders avatar with fallback", () => {
    mockAccount({ username: "testuser" });

    render(<AppSidebarAccount />);

    expect(
      screen.getAllByTestId("avatar-fallback").length
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders profile link when username exists", () => {
    mockAccount({ username: "testuser" });

    render(<AppSidebarAccount />);

    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("renders settings link when username exists", () => {
    mockAccount({ username: "testuser" });

    render(<AppSidebarAccount />);

    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders logout button", () => {
    mockAccount({ username: "testuser" });

    render(<AppSidebarAccount />);

    expect(screen.getByTestId("auth-logout")).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });

  it("does not render profile/settings when no username", () => {
    mockAccount({});

    render(<AppSidebarAccount />);

    expect(screen.queryByText("Profile")).not.toBeInTheDocument();
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("positions dropdown on bottom when mobile", () => {
    (useSidebar as Mock).mockReturnValue({ isMobile: true });
    mockAccount({ username: "testuser" });

    render(<AppSidebarAccount />);

    expect(screen.getByTestId("dropdown-content")).toHaveAttribute(
      "data-side",
      "bottom"
    );
  });

  it("positions dropdown on right when not mobile", () => {
    (useSidebar as Mock).mockReturnValue({ isMobile: false });
    mockAccount({ username: "testuser" });

    render(<AppSidebarAccount />);

    expect(screen.getByTestId("dropdown-content")).toHaveAttribute(
      "data-side",
      "right"
    );
  });
});
