import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import ProblemActions from "./problem-actions";
import { useProblemEditorStore } from "../problem-editor-store";
import { useRunSubmission } from "../api/run-submission";
import { useCreateSubmission } from "../api/create-submission";
import { ProblemSetup } from "@/features/problems/models/problem-setup";
import { accountStore } from "@/features/account/account-store";
import { Account } from "@/features/auth/models/account.model";

vi.mock("../problem-editor-store");
vi.mock("../api/run-submission");
vi.mock("../api/create-submission");
vi.mock("@/features/account/account-store");
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockAccount: Account = {
  id: "user-1",
  username: "testuser",
  createdAt: new Date(),
  updatedAt: null,
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
  problem: {
    id: "1",
    title: "Two Sum",
    slug: "two-sum",
    difficulty: 1,
    tags: [],
    availableLanguages: [],
  },
  initialCode: "function solution() {}",
  testSuites: [],
};

type StoreState = {
  code: string;
  setup: ProblemSetup | null;
  setLastRunResult: (result: unknown) => void;
};

describe("ProblemActions", () => {
  const mockSetLastRunResult = vi.fn();
  const mockRunMutateAsync = vi.fn();
  const mockSubmitMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupMocks = (
    storeOverrides: Partial<StoreState> = {},
    runPending = false,
    submitPending = false,
    account: Account | null = mockAccount
  ) => {
    const defaultState: StoreState = {
      code: "function solution() { return 1; }",
      setup: mockSetup,
      setLastRunResult: mockSetLastRunResult,
      ...storeOverrides,
    };

    (useProblemEditorStore as unknown as Mock).mockImplementation(
      (selector: (state: StoreState) => unknown) => selector(defaultState)
    );

    (accountStore as unknown as Mock).mockImplementation(
      (selector: (state: { account: Account | null }) => unknown) =>
        selector({ account })
    );

    (useRunSubmission as Mock).mockReturnValue({
      mutateAsync: mockRunMutateAsync,
      isPending: runPending,
    });

    (useCreateSubmission as Mock).mockReturnValue({
      mutateAsync: mockSubmitMutateAsync,
      isPending: submitPending,
    });
  };

  it("renders Run button", () => {
    setupMocks();

    render(<ProblemActions slug="two-sum" />);

    expect(screen.getByRole("button", { name: "Run" })).toBeInTheDocument();
  });

  it("renders Submit button", () => {
    setupMocks();

    render(<ProblemActions slug="two-sum" />);

    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("renders View Submissions link", () => {
    setupMocks();

    render(<ProblemActions slug="two-sum" />);

    const link = screen.getByRole("link", { name: "View Submissions" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/problems/two-sum/submissions");
  });

  it("disables buttons when code is empty", () => {
    setupMocks({ code: "" });

    render(<ProblemActions slug="two-sum" />);

    expect(screen.getByRole("button", { name: "Run" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  it("uses default problemSetupId of 1 when setup is null", () => {
    setupMocks({ setup: null });

    render(<ProblemActions slug="two-sum" />);

    expect(screen.getByRole("button", { name: "Run" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Submit" })).not.toBeDisabled();
  });

  it("disables buttons when run mutation is pending", () => {
    setupMocks({}, true, false);

    render(<ProblemActions slug="two-sum" />);

    expect(screen.getByRole("button", { name: "Running..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  it("disables buttons when submit mutation is pending", () => {
    setupMocks({}, false, true);

    render(<ProblemActions slug="two-sum" />);

    expect(screen.getByRole("button", { name: "Run" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Running..." })).toBeDisabled();
  });

  it("shows 'Running...' text when run is pending", () => {
    setupMocks({}, true, false);

    render(<ProblemActions slug="two-sum" />);

    expect(screen.getByText("Running...")).toBeInTheDocument();
  });

  it("shows 'Running...' text when submit is pending", () => {
    setupMocks({}, false, true);

    render(<ProblemActions slug="two-sum" />);

    expect(screen.getByText("Running...")).toBeInTheDocument();
  });

  it("calls runSubmissionMutation when Run button is clicked", async () => {
    setupMocks();
    mockRunMutateAsync.mockResolvedValue({ submissionId: "123" });
    const user = userEvent.setup();

    render(<ProblemActions slug="two-sum" />);

    await user.click(screen.getByRole("button", { name: "Run" }));

    expect(mockRunMutateAsync).toHaveBeenCalledWith({
      code: "function solution() { return 1; }",
      problemSetupId: 1,
    });
  });

  it("calls submitSubmissionMutation when Submit button is clicked", async () => {
    setupMocks();
    mockSubmitMutateAsync.mockResolvedValue({ submissionId: "123" });
    const user = userEvent.setup();

    render(<ProblemActions slug="two-sum" />);

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(mockSubmitMutateAsync).toHaveBeenCalledWith({
      code: "function solution() { return 1; }",
      problemSetupId: 1,
    });
  });

  it("renders as ul element with list items", () => {
    setupMocks();

    render(<ProblemActions slug="two-sum" />);

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("buttons are enabled when code and setup are present", () => {
    setupMocks();

    render(<ProblemActions slug="two-sum" />);

    expect(screen.getByRole("button", { name: "Run" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Submit" })).not.toBeDisabled();
  });

  it("disables buttons and shows lock icon when not authenticated", () => {
    setupMocks({}, false, false, null);

    render(<ProblemActions slug="two-sum" />);

    expect(screen.getByRole("button", { name: /Run/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Submit/ })).toBeDisabled();
    expect(screen.getAllByTestId("lock-icon")).toHaveLength(2);
  });
});
