import { render, screen } from "@testing-library/react";
import ProblemLayout from "./problem-layout";
import { vi } from "vitest";

vi.mock("@/router-config", () => ({
  routerConfig: {
    home: { path: "/home" },
    problems: { path: "/problems" },
    problem: {
      execute: ({ slug }: any) => `/problems/${slug}`,
    },
  },
}));

vi.mock("@/components/layouts/sidebar-layout/sidebar-layout", () => ({
  default: ({ children, breadcrumbs, headerItems }: any) => (
    <div>
      <div data-testid="breadcrumbs">
        {breadcrumbs.map((b: any) => (
          <div key={b.url}>{b.name}</div>
        ))}
      </div>
      <div data-testid="header-items">{headerItems}</div>
      <div data-testid="layout-children">{children}</div>
    </div>
  ),
}));

vi.mock("./problem-actions/problem-actions", () => ({
  default: (props: any) => <div data-testid="problem-actions" {...props} />,
}));

vi.mock("./problem-editor/problem-editor", () => ({
  default: () => <div data-testid="problem-editor">Editor</div>,
}));

// Mock useProblemSetup
const mockUseProblemSetup = vi.fn();
vi.mock("./api/get-problem-setup", () => ({
  useProblemSetup: (...args: any) => mockUseProblemSetup(...args),
}));

// Mock Zustand store
const setProblem = vi.fn();
const setSetup = vi.fn();

vi.mock("./problem-editor-store", () => ({
  useProblemEditorStore: () => ({
    setup: null,
    problem: null,
    code: "",
    currentVersionId: 99,
    actions: {
      setProblem,
      setSetup,
      changeCode: vi.fn(),
      resetCode: vi.fn(),
      changeCurrentVersion: vi.fn(),
      getLanguage: vi.fn(),
      getLanguageVersion: vi.fn(),
      getAvailableLanguages: vi.fn(),
    },
  }),
}));

describe("ProblemLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseProblemSetup.mockReturnValue({ data: null });
  });

  const fakeProblem = {
    id: 1,
    title: "My Problem",
    slug: "my-problem",
  } as any;

  it("renders breadcrumbs, actions, and editor", () => {
    render(<ProblemLayout problem={fakeProblem} />);
    expect(screen.getByTestId("breadcrumbs")).toHaveTextContent("Home");
    expect(screen.getByTestId("breadcrumbs")).toHaveTextContent("Problems");
    expect(screen.getByTestId("breadcrumbs")).toHaveTextContent("My Problem");
    expect(screen.getByTestId("problem-actions")).toBeInTheDocument();
    expect(screen.getByTestId("problem-editor")).toBeInTheDocument();
  });

  it("calls setProblem with provided problem", () => {
    render(<ProblemLayout problem={fakeProblem} />);
    expect(setProblem).toHaveBeenCalledWith(fakeProblem);
  });

  it("calls setSetup when problem setup API returns data", () => {
    mockUseProblemSetup.mockReturnValue({ data: { test: "value" } });
    render(<ProblemLayout problem={fakeProblem} />);
    expect(setSetup).toHaveBeenCalledWith({ test: "value" });
  });

  it("passes correct parameters to useProblemSetup", () => {
    render(<ProblemLayout problem={fakeProblem} />);
    expect(mockUseProblemSetup).toHaveBeenCalledWith({
      problemId: 1,
      languageVersionId: 99,
    });
  });

  it("sets null setup when API returns undefined", () => {
    mockUseProblemSetup.mockReturnValue({ data: undefined });
    render(<ProblemLayout problem={fakeProblem} />);
    expect(setSetup).toHaveBeenCalledWith(null);
  });
});
