import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProblemDifficultyBadge } from "./problem-difficulty-badge";

describe("ProblemDifficultyBadge", () => {
  it("renders difficulty value", () => {
    render(<ProblemDifficultyBadge difficulty={5} />);

    expect(screen.getByText("Difficulty: 5")).toBeInTheDocument();
  });

  it("renders with difficulty 0", () => {
    render(<ProblemDifficultyBadge difficulty={0} />);

    expect(screen.getByText("Difficulty: 0")).toBeInTheDocument();
  });

  it("renders with high difficulty value", () => {
    render(<ProblemDifficultyBadge difficulty={100} />);

    expect(screen.getByText("Difficulty: 100")).toBeInTheDocument();
  });

  it("renders Badge component with data-slot attribute", () => {
    render(<ProblemDifficultyBadge difficulty={3} />);

    const badge = screen.getByText("Difficulty: 3");
    expect(badge).toHaveAttribute("data-slot", "badge");
  });

  it("renders with negative difficulty value", () => {
    render(<ProblemDifficultyBadge difficulty={-1} />);

    expect(screen.getByText("Difficulty: -1")).toBeInTheDocument();
  });
});
