import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProblemLoading from "./loading";

vi.mock("@/components/layouts/sidebar-layout/sidebar-layout", () => ({
  default: ({
    children,
    defaultOpen,
  }: {
    children: React.ReactNode;
    defaultOpen?: boolean;
  }) => (
    <div data-testid="sidebar-layout" data-default-open={defaultOpen}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
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
  CardHeader: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="card-header" className={className}>
      {children}
    </div>
  ),
}));

describe("ProblemLoading", () => {
  it("renders the sidebar layout with defaultOpen true", () => {
    render(<ProblemLoading />);

    const layout = screen.getByTestId("sidebar-layout");
    expect(layout).toBeInTheDocument();
    expect(layout).toHaveAttribute("data-default-open", "true");
  });

  it("renders skeleton placeholders", () => {
    render(<ProblemLoading />);

    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders two panel cards", () => {
    render(<ProblemLoading />);

    const cards = screen.getAllByTestId("card");
    expect(cards.length).toBeGreaterThanOrEqual(2);
  });
});
