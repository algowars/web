import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act } from "@testing-library/react";
import ProblemSubmissionsHeader from "./problem-submissions-header";
import { useProblemSubmissionsStore } from "./problem-submissions-store";
import { ProblemSubmissionsOptions } from "./problem-submissions-options";
import type { Problem } from "@/features/problems/models/problem";

vi.mock("@/components/markdown/markdown", () => ({
  default: ({ markdown }: { markdown: string }) => <div>{markdown}</div>,
}));

const mockProblem: Problem = {
  id: "problem-1",
  title: "Two Sum",
  slug: "two-sum",
  question: "Given an array of integers...",
  tags: ["array", "hash-table"],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("ProblemSubmissionsHeader", () => {
  beforeEach(() => {
    act(() => {
      useProblemSubmissionsStore.setState({
        problem: null,
        filterOption: ProblemSubmissionsOptions.ALL_SOLUTIONS,
        total: 0,
      });
    });
  });

  it("renders nothing when problem is not set", () => {
    const { container } = render(<ProblemSubmissionsHeader />);

    expect(container.firstChild).toBeNull();
  });

  it("renders the problem title when problem is set", () => {
    act(() => {
      useProblemSubmissionsStore.getState().initProblem(mockProblem);
    });

    render(<ProblemSubmissionsHeader />);

    expect(screen.getByText("Two Sum")).toBeInTheDocument();
  });

  it("renders each tag as a badge", () => {
    act(() => {
      useProblemSubmissionsStore.getState().initProblem(mockProblem);
    });

    render(<ProblemSubmissionsHeader />);

    expect(screen.getByText("array")).toBeInTheDocument();
    expect(screen.getByText("hash-table")).toBeInTheDocument();
  });

  it("renders the description accordion trigger", () => {
    act(() => {
      useProblemSubmissionsStore.getState().initProblem(mockProblem);
    });

    render(<ProblemSubmissionsHeader />);

    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("passes className to the card", () => {
    act(() => {
      useProblemSubmissionsStore.getState().initProblem(mockProblem);
    });

    render(<ProblemSubmissionsHeader className="col-span-12" />);

    const card = screen.getByText("Two Sum").closest(".col-span-12");
    expect(card).toBeInTheDocument();
  });
});
