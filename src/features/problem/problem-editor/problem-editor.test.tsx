import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import ProblemEditor from "./problem-editor";
import { useProblemEditorStore } from "../problem-editor-store";
import { Problem } from "@/features/problems/models/problem";
import { ProblemSetup } from "@/features/problems/models/problem-setup";
import { RunResult } from "../models/run-result";

vi.mock("../problem-editor-store");

vi.mock("@/components/editor/editor", () => ({
  Editor: () => <div data-testid="editor">Editor Component</div>,
}));

vi.mock("@/components/code-editor/code-editor", () => ({
  CodeEditor: ({ className }: { className?: string }) => (
    <div data-testid="code-editor" className={className}>
      Code Editor
    </div>
  ),
}));

vi.mock("../problem-question/problem-question", () => ({
  default: ({ problem }: { problem: Problem | null }) => (
    <div data-testid="problem-question">{problem?.title}</div>
  ),
}));

vi.mock("../problem-test-cases/problem-test-cases", () => ({
  default: () => <div data-testid="problem-test-cases">Test Cases</div>,
}));

const mockProblem: Problem = {
  id: "1",
  title: "Two Sum",
  slug: "two-sum",
  question: "Given an array...",
  difficulty: { rating: 1, name: "Easy" },
  tags: ["array"],
  availableLanguages: [],
};

const mockSetup: ProblemSetup = {
  id: 1,
  defaultLanguageId: 1,
  defaultLanguageVersionId: 1,
  languageVersionId: 1,
  createdOn: Date.now(),
  createdBy: {
    id: "user-1",
    username: "testuser",
    createdAt: new Date(),
    updatedAt: null,
  },
  version: 1,
  problem: mockProblem,
  initialCode: "function solution() {}",
  testSuites: [],
};

const mockRunResult: RunResult = {
  submissionId: "sub-1",
  status: "completed" as never,
  testCases: [],
};

type StoreState = {
  setup: ProblemSetup | null;
  problem: Problem | null;
  lastRunResult: RunResult | null;
};

describe("ProblemEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupMock = (overrides: Partial<StoreState> = {}) => {
    const defaultState: StoreState = {
      setup: mockSetup,
      problem: mockProblem,
      lastRunResult: null,
      ...overrides,
    };

    (useProblemEditorStore as unknown as Mock).mockImplementation(
      (selector: (state: StoreState) => unknown) => selector(defaultState)
    );
  };

  it("renders skeleton loading state when setup is null", () => {
    setupMock({ setup: null });

    const { container } = render(<ProblemEditor />);

    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders skeleton loading state when problem is null", () => {
    setupMock({ problem: null });

    const { container } = render(<ProblemEditor />);

    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders skeleton loading state when both setup and problem are null", () => {
    setupMock({ setup: null, problem: null });

    const { container } = render(<ProblemEditor />);

    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders Editor component when setup and problem are available", () => {
    setupMock();

    render(<ProblemEditor />);

    expect(screen.getByTestId("editor")).toBeInTheDocument();
  });

  it("does not render skeleton when setup and problem are available", () => {
    setupMock();

    const { container } = render(<ProblemEditor />);

    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBe(0);
  });

  it("renders without lastRunResult", () => {
    setupMock({ lastRunResult: null });

    render(<ProblemEditor />);

    expect(screen.getByTestId("editor")).toBeInTheDocument();
  });

  it("renders with lastRunResult", () => {
    setupMock({ lastRunResult: mockRunResult });

    render(<ProblemEditor />);

    expect(screen.getByTestId("editor")).toBeInTheDocument();
  });
});
