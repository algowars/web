import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Dashboard from "./dashboard";

vi.mock("@/components/layouts/sidebar-layout/sidebar-layout", () => ({
  default: ({
    children,
    breadcrumbs,
  }: {
    children: React.ReactNode;
    breadcrumbs: { name: string; url: string }[];
  }) => (
    <div
      data-testid="sidebar-layout"
      data-breadcrumbs={JSON.stringify(breadcrumbs)}
    >
      {children}
    </div>
  ),
}));

vi.mock("../problems/problems-table-v2/problems-table-v2", () => ({
  default: () => <div data-testid="problems-table">Problems Table</div>,
}));

describe("Dashboard", () => {
  it("renders SidebarLayout", () => {
    render(<Dashboard />);

    expect(screen.getByTestId("sidebar-layout")).toBeInTheDocument();
  });

  it("renders ProblemsTableV2 component", () => {
    render(<Dashboard />);

    expect(screen.getByTestId("problems-table")).toBeInTheDocument();
  });

  it("renders Problems card title", () => {
    render(<Dashboard />);

    expect(screen.getByText("Problems")).toBeInTheDocument();
  });

  it("passes correct breadcrumbs to SidebarLayout", () => {
    render(<Dashboard />);

    const layout = screen.getByTestId("sidebar-layout");
    const breadcrumbs = JSON.parse(
      layout.getAttribute("data-breadcrumbs") || "[]"
    );

    expect(breadcrumbs).toEqual([{ name: "Home", url: "/" }]);
  });

  it("renders Card component", () => {
    const { container } = render(<Dashboard />);

    const card = container.querySelector('[data-slot="card"]');
    expect(card).toBeInTheDocument();
  });

  it("renders CardHeader", () => {
    const { container } = render(<Dashboard />);

    const cardHeader = container.querySelector('[data-slot="card-header"]');
    expect(cardHeader).toBeInTheDocument();
  });

  it("renders CardContent", () => {
    const { container } = render(<Dashboard />);

    const cardContent = container.querySelector('[data-slot="card-content"]');
    expect(cardContent).toBeInTheDocument();
  });

  it("renders ProblemsTableV2 inside CardContent", () => {
    render(<Dashboard />);

    const problemsTable = screen.getByTestId("problems-table");
    expect(problemsTable).toBeInTheDocument();
  });
});
