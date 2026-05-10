import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProblemQuestion from "./problem-question";
import { Problem } from "@/features/problems/models/problem";

vi.mock("@/components/markdown/markdown", () => ({
  default: ({ markdown }: { markdown: string | null | undefined }) => (
    <div data-testid="markdown-content">{markdown}</div>
  ),
}));

vi.mock("./problem-editor-tags", () => ({
  default: ({ tags }: { tags: string[] }) => (
    <div data-testid="problem-tags">{tags.join(", ")}</div>
  ),
}));

const mockProblem: Problem = {
  id: "1",
  title: "Two Sum",
  slug: "two-sum",
  question: "Given an array of integers, return indices of two numbers.",
  difficulty: 1,
  tags: ["array", "hash-table"],
  availableLanguages: [],
};

describe("ProblemQuestion", () => {
  it("returns null when problem is null", () => {
    const { container } = render(<ProblemQuestion problem={null} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders problem title", () => {
    render(<ProblemQuestion problem={mockProblem} />);

    expect(screen.getByText("Two Sum")).toBeInTheDocument();
  });

  it("renders markdown content with problem question", () => {
    render(<ProblemQuestion problem={mockProblem} />);

    const markdownContent = screen.getByTestId("markdown-content");
    expect(markdownContent).toBeInTheDocument();
    expect(markdownContent).toHaveTextContent(
      "Given an array of integers, return indices of two numbers."
    );
  });

  it("renders Tags accordion trigger", () => {
    render(<ProblemQuestion problem={mockProblem} />);

    expect(screen.getByText("Tags")).toBeInTheDocument();
  });

  it("renders copyright text", () => {
    render(<ProblemQuestion problem={mockProblem} />);

    expect(
      screen.getByText(`© ${new Date().getFullYear()} Algowars`)
    ).toBeInTheDocument();
  });

  it("renders problem with empty tags array", () => {
    const problemWithNoTags: Problem = {
      ...mockProblem,
      tags: [],
    };

    render(<ProblemQuestion problem={problemWithNoTags} />);

    expect(screen.getByText("Two Sum")).toBeInTheDocument();
  });

  it("renders problem with undefined question", () => {
    const problemWithNoQuestion: Problem = {
      ...mockProblem,
      question: undefined,
    };

    render(<ProblemQuestion problem={problemWithNoQuestion} />);

    expect(screen.getByText("Two Sum")).toBeInTheDocument();
    expect(screen.getByTestId("markdown-content")).toBeInTheDocument();
  });

  it("renders h2 heading with correct styling class", () => {
    render(<ProblemQuestion problem={mockProblem} />);

    const heading = screen.getByRole("heading", { level: 2, name: "Two Sum" });
    expect(heading).toBeInTheDocument();
  });
});
