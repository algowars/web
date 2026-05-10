import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProblemSubmissionsSkeleton from "./problem-submissions-skeleton";

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

describe("ProblemSubmissionsSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<ProblemSubmissionsSkeleton />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders skeleton placeholders for 4 submission rows", () => {
    render(<ProblemSubmissionsSkeleton />);

    const skeletons = screen.getAllByTestId("skeleton");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("forwards extra props to the root Card", () => {
    const { container } = render(
      <ProblemSubmissionsSkeleton className="col-span-9" />
    );

    expect(container.firstChild).toHaveClass("col-span-9");
  });
});
