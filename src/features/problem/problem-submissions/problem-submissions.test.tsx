import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act } from "@testing-library/react";
import ProblemSubmissions, {
  ProblemSolutions,
  ProblemSubmissionsEmpty,
} from "./problem-submissions";
import { useProblemSubmissionsStore } from "./problem-submissions-store";
import { ProblemSubmissionsOptions } from "./problem-submissions-options";
import { SubmissionStatus } from "../models/submission-status";
import type { ProblemSubmission } from "../models/problem-submission";

vi.mock("react-infinite-scroll-component", () => ({
  default: ({
    children,
    loader,
    endMessage,
  }: {
    children: React.ReactNode;
    loader: React.ReactNode;
    endMessage?: React.ReactNode;
  }) => (
    <div data-testid="infinite-scroll">
      {children}
      {loader}
      {endMessage}
    </div>
  ),
}));

vi.mock("./submission-card", () => ({
  default: ({ submission }: { submission: { id: string } }) => (
    <div data-testid="submission-card">{submission.id}</div>
  ),
}));

vi.mock("./problem-submissions-store", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("./problem-submissions-store")>();
  return {
    ...actual,
    useSuspenseProblemSubmissionsWithStore: vi.fn(),
    useSuspenseProblemSolutionsWithStore: vi.fn(),
  };
});

import {
  useSuspenseProblemSubmissionsWithStore,
  useSuspenseProblemSolutionsWithStore,
} from "./problem-submissions-store";

const mockSubmission: ProblemSubmission = {
  id: "sub-1",
  code: "print('hello')",
  status: SubmissionStatus.ACCEPTED,
  language: "Python",
  languageVersion: "3.12",
  runtimeMs: 42,
  memoryKb: 128,
  createdOn: new Date(),
  createdBy: {
    id: "user-1",
    username: "alice",
    createdAt: new Date(),
    updatedAt: null,
    usernameLastChangedAt: null,
  },
};

const mockPageResult = {
  results: [mockSubmission],
  total: 1,
  hasMore: false,
};

describe("ProblemSubmissionsEmpty", () => {
  it("renders the Submissions title", () => {
    render(<ProblemSubmissionsEmpty />);

    expect(screen.getByText("Submissions")).toBeInTheDocument();
  });

  it("renders 0 submissions count", () => {
    render(<ProblemSubmissionsEmpty />);

    expect(screen.getByText("0 submissions")).toBeInTheDocument();
  });

  it("renders the empty state message", () => {
    render(<ProblemSubmissionsEmpty />);

    expect(screen.getByText("No accepted solutions yet.")).toBeInTheDocument();
  });
});

describe("ProblemSubmissions", () => {
  beforeEach(() => {
    act(() => {
      useProblemSubmissionsStore.setState({
        submissions: [],
        page: 1,
        total: 0,
        hasMore: true,
        filterOption: ProblemSubmissionsOptions.ALL_SOLUTIONS,
      });
    });

    vi.mocked(useSuspenseProblemSubmissionsWithStore).mockReturnValue({
      data: mockPageResult,
      isLoading: false,
    } as ReturnType<typeof useSuspenseProblemSubmissionsWithStore>);
  });

  it("renders the empty state when there are no submissions", () => {
    vi.mocked(useSuspenseProblemSubmissionsWithStore).mockReturnValue({
      data: { results: [], total: 0, hasMore: false },
      isLoading: false,
    } as ReturnType<typeof useSuspenseProblemSubmissionsWithStore>);

    render(<ProblemSubmissions />);

    expect(screen.getByText("No accepted solutions yet.")).toBeInTheDocument();
  });

  it("renders submission cards when data is loaded", () => {
    act(() => {
      useProblemSubmissionsStore.getState().setSubmissions([mockSubmission]);
    });

    render(<ProblemSubmissions />);

    expect(screen.getByTestId("submission-card")).toBeInTheDocument();
  });

  it("renders the Submissions heading", () => {
    act(() => {
      useProblemSubmissionsStore.getState().setSubmissions([mockSubmission]);
      useProblemSubmissionsStore.getState().setTotal(1);
    });

    render(<ProblemSubmissions />);

    expect(screen.getByText("Submissions")).toBeInTheDocument();
  });

  it("renders the total count with 'submissions' label", () => {
    act(() => {
      useProblemSubmissionsStore.getState().setSubmissions([mockSubmission]);
    });

    vi.mocked(useSuspenseProblemSubmissionsWithStore).mockReturnValue({
      data: { results: [mockSubmission], total: 5, hasMore: false },
      isLoading: false,
    } as ReturnType<typeof useSuspenseProblemSubmissionsWithStore>);

    render(<ProblemSubmissions />);

    expect(screen.getByText(/5\s+submissions/)).toBeInTheDocument();
  });
});

describe("ProblemSolutions", () => {
  beforeEach(() => {
    act(() => {
      useProblemSubmissionsStore.setState({
        submissions: [],
        page: 1,
        total: 0,
        hasMore: true,
        filterOption: ProblemSubmissionsOptions.ALL_SOLUTIONS,
      });
    });

    vi.mocked(useSuspenseProblemSolutionsWithStore).mockReturnValue({
      data: mockPageResult,
      isLoading: false,
    } as ReturnType<typeof useSuspenseProblemSolutionsWithStore>);
  });

  it("renders the empty state when there are no solutions", () => {
    vi.mocked(useSuspenseProblemSolutionsWithStore).mockReturnValue({
      data: { results: [], total: 0, hasMore: false },
      isLoading: false,
    } as ReturnType<typeof useSuspenseProblemSolutionsWithStore>);

    render(<ProblemSolutions />);

    expect(screen.getByText("No accepted solutions yet.")).toBeInTheDocument();
  });

  it("renders solution cards when data is loaded", () => {
    act(() => {
      useProblemSubmissionsStore.getState().setSubmissions([mockSubmission]);
    });

    render(<ProblemSolutions />);

    expect(screen.getByTestId("submission-card")).toBeInTheDocument();
  });

  it("renders the Solutions heading", () => {
    act(() => {
      useProblemSubmissionsStore.getState().setSubmissions([mockSubmission]);
      useProblemSubmissionsStore.getState().setTotal(3);
    });

    render(<ProblemSolutions />);

    expect(screen.getByText("Solutions")).toBeInTheDocument();
  });

  it("renders the total count with 'solutions' label", () => {
    act(() => {
      useProblemSubmissionsStore.getState().setSubmissions([mockSubmission]);
    });

    vi.mocked(useSuspenseProblemSolutionsWithStore).mockReturnValue({
      data: { results: [mockSubmission], total: 3, hasMore: false },
      isLoading: false,
    } as ReturnType<typeof useSuspenseProblemSolutionsWithStore>);

    render(<ProblemSolutions />);

    expect(screen.getByText(/3\s+solutions/)).toBeInTheDocument();
  });
});
