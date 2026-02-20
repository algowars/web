import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AppSidebarHeader from "./app-sidebar-header";

vi.mock("@/components/theme/mode-toggle", () => ({
  ModeToggle: ({ className }: { className?: string }) => (
    <button data-testid="mode-toggle" className={className}>
      Theme
    </button>
  ),
}));

vi.mock("@/components/ui/sidebar", () => ({
  SidebarTrigger: ({ className }: { className?: string }) => (
    <button data-testid="sidebar-trigger" className={className}>
      Toggle
    </button>
  ),
}));

vi.mock("@/components/ui/separator", () => ({
  Separator: ({ orientation }: { orientation?: string }) => (
    <hr data-testid="separator" data-orientation={orientation} />
  ),
}));

vi.mock("@/components/ui/breadcrumb", () => ({
  Breadcrumb: ({ children }: { children: React.ReactNode }) => (
    <nav data-testid="breadcrumb">{children}</nav>
  ),
  BreadcrumbItem: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <li data-testid="breadcrumb-item" className={className}>
      {children}
    </li>
  ),
  BreadcrumbLink: ({
    children,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => <span data-testid="breadcrumb-link">{children}</span>,
  BreadcrumbList: ({ children }: { children: React.ReactNode }) => (
    <ol data-testid="breadcrumb-list">{children}</ol>
  ),
  BreadcrumbPage: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="breadcrumb-page">{children}</span>
  ),
  BreadcrumbSeparator: ({ className }: { className?: string }) => (
    <span data-testid="breadcrumb-separator" className={className}>
      /
    </span>
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

describe("AppSidebarHeader", () => {
  it("renders sidebar trigger", () => {
    render(<AppSidebarHeader />);

    expect(screen.getByTestId("sidebar-trigger")).toBeInTheDocument();
  });

  it("renders mode toggle", () => {
    render(<AppSidebarHeader />);

    expect(screen.getByTestId("mode-toggle")).toBeInTheDocument();
  });

  it("renders separator", () => {
    render(<AppSidebarHeader />);

    expect(screen.getByTestId("separator")).toBeInTheDocument();
  });

  it("does not render breadcrumb when no breadcrumbs provided", () => {
    render(<AppSidebarHeader />);

    expect(screen.queryByTestId("breadcrumb")).not.toBeInTheDocument();
  });

  it("renders breadcrumb when breadcrumbs provided", () => {
    render(
      <AppSidebarHeader
        breadcrumbs={[{ name: "Home", url: "/" }]}
      />
    );

    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
  });

  it("renders breadcrumb items", () => {
    render(
      <AppSidebarHeader
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Problems", url: "/problems" },
        ]}
      />
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Problems")).toBeInTheDocument();
  });

  it("renders last breadcrumb without link", () => {
    render(
      <AppSidebarHeader
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Current Page" },
        ]}
      />
    );

    const pages = screen.getAllByTestId("breadcrumb-page");
    expect(pages[pages.length - 1]).toHaveTextContent("Current Page");
  });

  it("renders separators between breadcrumbs", () => {
    render(
      <AppSidebarHeader
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Problems", url: "/problems" },
          { name: "Current" },
        ]}
      />
    );

    const separators = screen.getAllByTestId("breadcrumb-separator");
    expect(separators).toHaveLength(2);
  });

  it("renders headerItems when provided", () => {
    render(
      <AppSidebarHeader
        headerItems={<div data-testid="custom-header-item">Custom</div>}
      />
    );

    expect(screen.getByTestId("custom-header-item")).toBeInTheDocument();
  });
});
