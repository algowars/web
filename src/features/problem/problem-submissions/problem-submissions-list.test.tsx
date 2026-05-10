import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProblemSubmissionsList from "./problem-submissions-list";
import { SubmissionStatus } from "../models/submission-status";
import type { ProblemSubmission } from "../models/problem-submission";

vi.mock("./submission-card", () => ({
  default: ({ submission }: { submission: ProblemSubmission }) => (
    <div data-testid="submission-card" data-id={submission.id}>
      {submission.id}
    </div>
  ),
}));

const makeSubmission = (id: string): ProblemSubmission => ({
  id,
  code: "console.log('hello')",
  status: SubmissionStatus.ACCEPTED,
  language: "JavaScript",
  languageVersion: "18",
  runtimeMs: 50,
  memoryKb: 256,
  createdOn: new Date("2024-01-01"),
  createdBy: {
    id: "user-1",
    username: "testuser",
    createdAt: new Date("2024-01-01"),
    updatedAt: null,
    usernameLastChangedAt: null,
  },
});

describe("ProblemSubmissionsList", () => {
  it("renders an empty list when no submissions", () => {
    render(<ProblemSubmissionsList submissions={[]} />);

    expect(screen.queryAllByTestId("submission-card")).toHaveLength(0);
  });

  it("renders a card for each submission", () => {
    const submissions = [makeSubmission("sub-1"), makeSubmission("sub-2")];

    render(<ProblemSubmissionsList submissions={submissions} />);

    expect(screen.getAllByTestId("submission-card")).toHaveLength(2);
  });

  it("passes each submission to SubmissionCard", () => {
    const submissions = [makeSubmission("sub-1"), makeSubmission("sub-2")];

    render(<ProblemSubmissionsList submissions={submissions} />);

    expect(screen.getByText("sub-1")).toBeInTheDocument();
    expect(screen.getByText("sub-2")).toBeInTheDocument();
  });
});
