import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import ProblemSubmissionsLayout from "./problem-submissions-layout";
import { useProblemSubmissionsStore } from "./problem-submissions-store";
import { ProblemSubmissionsOptions } from "./problem-submissions-options";
import type { Problem } from "@/features/problems/models/problem";

vi.mock("./problem-submissions-store", () => ({
  useProblemSubmissionsStore: vi.fn(),
}));

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

vi.mock("./problem-submissions-header", () => ({
  default: ({ className }: { className?: string }) => (
    <div data-testid="submissions-header" className={className} />
  ),
}));

vi.mock("./problem-submissions", () => ({
  default: ({ className }: { className?: string }) => (
    <div data-testid="problem-submissions" className={className} />
  ),
  ProblemSolutions: ({ className }: { className?: string }) => (
    <div data-testid="problem-solutions" className={className} />
  ),
  ProblemSubmissionsEmpty: ({ className }: { className?: string }) => (
    <div data-testid="submissions-empty" className={className} />
  ),
}));

vi.mock("./problem-submissions-alert", () => ({
  default: ({ className }: { className?: string }) => (
    <div data-testid="submissions-alert" className={className} />
  ),
}));

vi.mock("./problem-submissions-skeleton", () => ({
  default: ({ className }: { className?: string }) => (
    <div data-testid="submissions-skeleton" className={className} />
  ),
}));

vi.mock("./problem-submissions-filter", () => ({
  default: ({ className }: { className?: string }) => (
    <div data-testid="submissions-filter" className={className} />
  ),
}));

const mockProblem: Problem = {
  id: "problem-1",
  title: "Two Sum",
  slug: "two-sum",
  difficulty: 1000,
  tags: [],
  availableLanguages: [],
};

const mockInitProblem = vi.fn();

function setupStore(filterOption: ProblemSubmissionsOptions) {
  (useProblemSubmissionsStore as unknown as Mock).mockImplementation(
    (
      selector: (s: {
        initProblem: typeof mockInitProblem;
        filterOption: ProblemSubmissionsOptions;
      }) => unknown
    ) => selector({ initProblem: mockInitProblem, filterOption })
  );
}

describe("ProblemSubmissionsLayout", () => {
  beforeEach(() => {
    mockInitProblem.mockClear();
    setupStore(ProblemSubmissionsOptions.ALL_SOLUTIONS);
  });

  it("renders the sidebar layout", () => {
    render(<ProblemSubmissionsLayout problem={mockProblem} />);

    expect(screen.getByTestId("sidebar-layout")).toBeInTheDocument();
  });

  it("calls initProblem with the problem", () => {
    render(<ProblemSubmissionsLayout problem={mockProblem} />);

    expect(mockInitProblem).toHaveBeenCalledWith(mockProblem);
  });

  it("renders ProblemSolutions when filter is ALL_SOLUTIONS", () => {
    setupStore(ProblemSubmissionsOptions.ALL_SOLUTIONS);

    render(<ProblemSubmissionsLayout problem={mockProblem} />);

    expect(screen.getByTestId("problem-solutions")).toBeInTheDocument();
    expect(screen.queryByTestId("problem-submissions")).not.toBeInTheDocument();
  });

  it("renders ProblemSubmissions when filter is MY_SUBMISSIONS", () => {
    setupStore(ProblemSubmissionsOptions.MY_SUBMISSIONS);

    render(<ProblemSubmissionsLayout problem={mockProblem} />);

    expect(screen.getByTestId("problem-submissions")).toBeInTheDocument();
    expect(screen.queryByTestId("problem-solutions")).not.toBeInTheDocument();
  });

  it("renders submissions filter", () => {
    render(<ProblemSubmissionsLayout problem={mockProblem} />);

    expect(screen.getByTestId("submissions-filter")).toBeInTheDocument();
  });

  it("includes problem slug in breadcrumbs", () => {
    render(<ProblemSubmissionsLayout problem={mockProblem} />);

    const layout = screen.getByTestId("sidebar-layout");
    const breadcrumbs = JSON.parse(
      layout.getAttribute("data-breadcrumbs") ?? "[]"
    );
    const slugBreadcrumb = breadcrumbs.find(
      (b: { name: string }) => b.name === mockProblem.slug
    );
    expect(slugBreadcrumb).toBeDefined();
  });
});
