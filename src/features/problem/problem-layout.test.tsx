import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import ProblemLayout from "./problem-layout";
import { useProblemEditorStore } from "./problem-editor-store";
import { useProblemSetup } from "./api/get-problem-setup";
import { Problem } from "@/features/problems/models/problem";
import { LanguageVersion } from "@/features/problems/models/language";

vi.mock("./problem-editor-store");
vi.mock("./api/get-problem-setup");

vi.mock("@/components/layouts/sidebar-layout/sidebar-layout", () => ({
  default: ({
    children,
    breadcrumbs,
    headerItems,
    defaultOpen,
  }: {
    children: React.ReactNode;
    breadcrumbs: { name: string; url: string }[];
    headerItems?: React.ReactNode;
    defaultOpen?: boolean;
  }) => (
    <div
      data-testid="sidebar-layout"
      data-breadcrumbs={JSON.stringify(breadcrumbs)}
      data-default-open={defaultOpen}
    >
      <div data-testid="header-items">{headerItems}</div>
      {children}
    </div>
  ),
}));

vi.mock("./problem-actions/problem-actions", () => ({
  default: ({ slug, className }: { slug: string; className?: string }) => (
    <div data-testid="problem-actions" data-slug={slug} className={className}>
      Problem Actions
    </div>
  ),
}));

vi.mock("./problem-editor/problem-editor", () => ({
  default: () => <div data-testid="problem-editor">Problem Editor</div>,
}));

vi.mock(
  "./problem-editor/problem-editor-language-select/problem-editor-language-select",
  () => ({
    default: ({ className }: { className?: string }) => (
      <div data-testid="language-select" className={className}>
        Language Select
      </div>
    ),
  })
);

const mockProblem: Problem = {
  id: "problem-1",
  title: "Two Sum",
  slug: "two-sum",
  question: "Given an array...",
  difficulty: { rating: 1, name: "Easy" },
  tags: ["array"],
  availableLanguages: [],
};

type StoreState = {
  getLanguageVersion: () => LanguageVersion | null;
  setProblem: (problem: Problem | null) => void;
  setSetup: (setup: unknown) => void;
};

describe("ProblemLayout", () => {
  const mockSetProblem = vi.fn();
  const mockSetSetup = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupMocks = (languageVersion: LanguageVersion | null = null) => {
    const defaultState: StoreState = {
      getLanguageVersion: () => languageVersion,
      setProblem: mockSetProblem,
      setSetup: mockSetSetup,
    };

    (useProblemEditorStore as unknown as Mock).mockImplementation(
      (selector: (state: StoreState) => unknown) => selector(defaultState)
    );

    (useProblemSetup as Mock).mockReturnValue({
      data: null,
    });
  };

  it("renders SidebarLayout", () => {
    setupMocks();

    render(<ProblemLayout problem={mockProblem} />);

    expect(screen.getByTestId("sidebar-layout")).toBeInTheDocument();
  });

  it("renders ProblemEditor", () => {
    setupMocks();

    render(<ProblemLayout problem={mockProblem} />);

    expect(screen.getByTestId("problem-editor")).toBeInTheDocument();
  });

  it("renders ProblemActions in header", () => {
    setupMocks();

    render(<ProblemLayout problem={mockProblem} />);

    expect(screen.getByTestId("problem-actions")).toBeInTheDocument();
  });

  it("renders ProblemCodeEditorLanguageSelect in header", () => {
    setupMocks();

    render(<ProblemLayout problem={mockProblem} />);

    expect(screen.getByTestId("language-select")).toBeInTheDocument();
  });

  it("passes correct breadcrumbs to SidebarLayout", () => {
    setupMocks();

    render(<ProblemLayout problem={mockProblem} />);

    const layout = screen.getByTestId("sidebar-layout");
    const breadcrumbs = JSON.parse(
      layout.getAttribute("data-breadcrumbs") || "[]"
    );

    expect(breadcrumbs).toEqual([
      { url: "/", name: "Home" },
      { url: "/problems", name: "Problems" },
      { url: "/problems/two-sum", name: "Two Sum" },
    ]);
  });

  it("passes defaultOpen=false to SidebarLayout", () => {
    setupMocks();

    render(<ProblemLayout problem={mockProblem} />);

    const layout = screen.getByTestId("sidebar-layout");
    expect(layout.getAttribute("data-default-open")).toBe("false");
  });

  it("passes slug to ProblemActions", () => {
    setupMocks();

    render(<ProblemLayout problem={mockProblem} />);

    const actions = screen.getByTestId("problem-actions");
    expect(actions.getAttribute("data-slug")).toBe("two-sum");
  });

  it("calls useProblemSetup with problemId", () => {
    setupMocks();

    render(<ProblemLayout problem={mockProblem} />);

    expect(useProblemSetup).toHaveBeenCalledWith(
      expect.objectContaining({
        problemId: "problem-1",
      })
    );
  });

  it("calls useProblemSetup with languageVersionId when available", () => {
    const mockVersion: LanguageVersion = { id: 101, version: "ES2022" };
    setupMocks(mockVersion);

    render(<ProblemLayout problem={mockProblem} />);

    expect(useProblemSetup).toHaveBeenCalledWith(
      expect.objectContaining({
        languageVersionId: 101,
      })
    );
  });

  it("calls setProblem with problem on mount", () => {
    setupMocks();

    render(<ProblemLayout problem={mockProblem} />);

    expect(mockSetProblem).toHaveBeenCalledWith(mockProblem);
  });

  it("calls setSetup with null when setup data is undefined", () => {
    setupMocks();

    render(<ProblemLayout problem={mockProblem} />);

    expect(mockSetSetup).toHaveBeenCalledWith(null);
  });

  it("renders header items container", () => {
    setupMocks();

    render(<ProblemLayout problem={mockProblem} />);

    expect(screen.getByTestId("header-items")).toBeInTheDocument();
  });
});
