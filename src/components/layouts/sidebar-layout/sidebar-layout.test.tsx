import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SidebarLayout from "./sidebar-layout";

vi.mock("@/components/ui/sidebar", () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-provider">{children}</div>
  ),
  SidebarInset: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-inset">{children}</div>
  ),
}));

vi.mock("./app-sidebar/app-sidebar", () => ({
  default: () => <aside data-testid="app-sidebar">Sidebar</aside>,
}));

vi.mock("./app-sidebar/app-sidebar-header", () => ({
  default: ({
    breadcrumbs,
    headerItems,
  }: {
    breadcrumbs: Array<{ name: string; url?: string }>;
    headerItems?: React.ReactNode;
  }) => (
    <header data-testid="sidebar-header">
      {breadcrumbs.map((b: { name: string }) => (
        <span key={b.name}>{b.name}</span>
      ))}
      {headerItems}
    </header>
  ),
}));

describe("SidebarLayout", () => {
  const mockBreadcrumbs = [{ name: "Home", url: "/" }, { name: "Settings" }];

  it("renders sidebar provider", () => {
    render(
      <SidebarLayout breadcrumbs={mockBreadcrumbs}>
        <div>Content</div>
      </SidebarLayout>
    );

    expect(screen.getByTestId("sidebar-provider")).toBeInTheDocument();
  });

  it("renders app sidebar", () => {
    render(
      <SidebarLayout breadcrumbs={mockBreadcrumbs}>
        <div>Content</div>
      </SidebarLayout>
    );

    expect(screen.getByTestId("app-sidebar")).toBeInTheDocument();
  });

  it("renders sidebar header", () => {
    render(
      <SidebarLayout breadcrumbs={mockBreadcrumbs}>
        <div>Content</div>
      </SidebarLayout>
    );

    expect(screen.getByTestId("sidebar-header")).toBeInTheDocument();
  });

  it("renders breadcrumb labels", () => {
    render(
      <SidebarLayout breadcrumbs={mockBreadcrumbs}>
        <div>Content</div>
      </SidebarLayout>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <SidebarLayout breadcrumbs={mockBreadcrumbs}>
        <div>Test Content</div>
      </SidebarLayout>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders header items", () => {
    render(
      <SidebarLayout
        breadcrumbs={mockBreadcrumbs}
        headerItems={<button>Header Button</button>}
      >
        <div>Content</div>
      </SidebarLayout>
    );

    expect(
      screen.getByRole("button", { name: "Header Button" })
    ).toBeInTheDocument();
  });

  it("applies custom className to content container", () => {
    const { container } = render(
      <SidebarLayout breadcrumbs={mockBreadcrumbs} className="custom-class">
        <div>Content</div>
      </SidebarLayout>
    );

    expect(container.querySelector(".custom-class")).toBeInTheDocument();
  });
});
