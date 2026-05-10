import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProblemsLoading from "./loading";

vi.mock("@/components/layouts/sidebar-layout/sidebar-layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-layout">{children}</div>
  ),
}));

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card">{children}</div>
  ),
  CardContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="card-title">{children}</h2>
  ),
}));

describe("ProblemsLoading", () => {
  it("renders the sidebar layout", () => {
    render(<ProblemsLoading />);

    expect(screen.getByTestId("sidebar-layout")).toBeInTheDocument();
  });

  it("renders Problems card title", () => {
    render(<ProblemsLoading />);

    expect(screen.getByText("Problems")).toBeInTheDocument();
  });

  it("renders skeleton placeholders", () => {
    render(<ProblemsLoading />);

    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
