import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SubmissionCard from "./submission-card";
import { SubmissionStatus } from "../models/submission-status";
import type { ProblemSubmission } from "../models/problem-submission";

vi.mock("@/components/code-block/code-block", () => ({
  default: ({
    children,
    language,
  }: {
    children: React.ReactNode;
    language: string;
  }) => (
    <pre data-testid="code-block" data-language={language}>
      {children}
    </pre>
  ),
}));

vi.mock(
  "@/features/submission/submissions-status/submission-status-badge",
  () => ({
    default: ({ status }: { status: string }) => (
      <span data-testid="status-badge">{status}</span>
    ),
  })
);

vi.mock("dayjs", () => {
  const dayjsMock = () => ({
    format: () => "Jan 01, 2026",
  });
  return { default: dayjsMock };
});

const baseSubmission: ProblemSubmission = {
  id: "sub-1",
  code: "print('hello')",
  status: SubmissionStatus.ACCEPTED,
  language: "Python",
  languageVersion: "3.12",
  runtimeMs: 42,
  memoryKb: 128,
  createdOn: new Date("2026-01-01"),
  createdBy: {
    id: "user-1",
    username: "alice",
    imageUrl: "https://example.com/alice.png",
    createdAt: new Date(),
    updatedAt: null,
    usernameLastChangedAt: null,
  },
};

describe("SubmissionCard", () => {
  it("renders the username", () => {
    render(<SubmissionCard submission={baseSubmission} />);

    expect(screen.getByRole("heading", { name: "alice" })).toBeInTheDocument();
  });

  it("renders the formatted date", () => {
    render(<SubmissionCard submission={baseSubmission} />);

    expect(screen.getByText("Jan 01, 2026")).toBeInTheDocument();
  });

  it("renders the status badge", () => {
    render(<SubmissionCard submission={baseSubmission} />);

    expect(screen.getByTestId("status-badge")).toBeInTheDocument();
  });

  it("renders the code block with lowercased language", () => {
    render(<SubmissionCard submission={baseSubmission} />);

    const codeBlock = screen.getByTestId("code-block");
    expect(codeBlock).toBeInTheDocument();
    expect(codeBlock).toHaveAttribute("data-language", "python");
  });

  it("renders the code content", () => {
    render(<SubmissionCard submission={baseSubmission} />);

    expect(screen.getByText("print('hello')")).toBeInTheDocument();
  });

  it("renders language and version", () => {
    render(<SubmissionCard submission={baseSubmission} />);

    expect(screen.getByText("Python - 3.12")).toBeInTheDocument();
  });

  it("renders runtime", () => {
    render(<SubmissionCard submission={baseSubmission} />);

    expect(screen.getByText("42 Ms")).toBeInTheDocument();
  });

  it("renders memory", () => {
    render(<SubmissionCard submission={baseSubmission} />);

    expect(screen.getByText("128 Kb")).toBeInTheDocument();
  });

  it("returns null when createdBy is missing", () => {
    const submission = {
      ...baseSubmission,
      createdBy: undefined as unknown as ProblemSubmission["createdBy"],
    };

    const { container } = render(<SubmissionCard submission={submission} />);

    expect(container.firstChild).toBeNull();
  });
});
