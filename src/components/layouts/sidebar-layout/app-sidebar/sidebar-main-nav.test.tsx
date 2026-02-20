import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SidebarMainNav } from "./sidebar-main-nav";
import { Puzzle, LayoutDashboard } from "lucide-react";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("@/components/ui/collapsible", () => ({
  Collapsible: ({
    children,
    defaultOpen,
  }: {
    children: React.ReactNode;
    defaultOpen?: boolean;
    asChild?: boolean;
  }) => (
    <div data-testid="collapsible" data-open={defaultOpen}>
      {children}
    </div>
  ),
  CollapsibleContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="collapsible-content">{children}</div>
  ),
  CollapsibleTrigger: ({
    children,
    asChild,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => <button data-testid="collapsible-trigger">{children}</button>,
}));

vi.mock("@/components/ui/sidebar", () => ({
  SidebarGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-group">{children}</div>
  ),
  SidebarGroupLabel: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="sidebar-group-label">{children}</span>
  ),
  SidebarMenu: ({ children }: { children: React.ReactNode }) => (
    <ul data-testid="sidebar-menu">{children}</ul>
  ),
  SidebarMenuAction: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <button data-testid="sidebar-menu-action">{children}</button>,
  SidebarMenuButton: ({
    children,
    asChild,
    tooltip,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
    tooltip?: string;
  }) => (
    <button data-testid="sidebar-menu-button" data-tooltip={tooltip}>
      {children}
    </button>
  ),
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
    <li data-testid="sidebar-menu-item">{children}</li>
  ),
  SidebarMenuSub: ({ children }: { children: React.ReactNode }) => (
    <ul data-testid="sidebar-menu-sub">{children}</ul>
  ),
  SidebarMenuSubButton: ({
    children,
    asChild,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => <button data-testid="sidebar-menu-sub-button">{children}</button>,
  SidebarMenuSubItem: ({ children }: { children: React.ReactNode }) => (
    <li data-testid="sidebar-menu-sub-item">{children}</li>
  ),
}));

describe("SidebarMainNav", () => {
  const mockItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Problems",
      url: "/problems",
      icon: Puzzle,
    },
  ];

  it("renders sidebar group", () => {
    render(<SidebarMainNav items={mockItems} />);

    expect(screen.getByTestId("sidebar-group")).toBeInTheDocument();
  });

  it("renders default title Platform", () => {
    render(<SidebarMainNav items={mockItems} />);

    expect(screen.getByTestId("sidebar-group-label")).toHaveTextContent(
      "Platform"
    );
  });

  it("renders custom title", () => {
    render(<SidebarMainNav items={mockItems} title="Custom Title" />);

    expect(screen.getByTestId("sidebar-group-label")).toHaveTextContent(
      "Custom Title"
    );
  });

  it("renders all menu items", () => {
    render(<SidebarMainNav items={mockItems} />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Problems")).toBeInTheDocument();
  });

  it("renders links with correct href", () => {
    render(<SidebarMainNav items={mockItems} />);

    expect(screen.getByRole("link", { name: /Dashboard/i })).toHaveAttribute(
      "href",
      "/dashboard"
    );
    expect(screen.getByRole("link", { name: /Problems/i })).toHaveAttribute(
      "href",
      "/problems"
    );
  });

  it("sets tooltip on menu button", () => {
    render(<SidebarMainNav items={mockItems} />);

    const buttons = screen.getAllByTestId("sidebar-menu-button");
    expect(buttons[0]).toHaveAttribute("data-tooltip", "Dashboard");
  });

  it("marks active item as open", () => {
    render(<SidebarMainNav items={mockItems} />);

    const collapsibles = screen.getAllByTestId("collapsible");
    expect(collapsibles[0]).toHaveAttribute("data-open", "true");
    expect(collapsibles[1]).not.toHaveAttribute("data-open", "true");
  });

  it("renders sub-items when present", () => {
    const itemsWithSubItems = [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        items: [
          { title: "Analytics", url: "/dashboard/analytics" },
          { title: "Reports", url: "/dashboard/reports" },
        ],
      },
    ];

    render(<SidebarMainNav items={itemsWithSubItems} />);

    expect(screen.getByTestId("collapsible-trigger")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Reports")).toBeInTheDocument();
  });
});
