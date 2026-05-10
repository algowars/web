import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProblemDifficultyBadge } from "./problem-difficulty-badge";

describe("ProblemDifficultyBadge", () => {
  it("renders Easy for low difficulty", () => {
    render(<ProblemDifficultyBadge difficulty={5} />);

    expect(screen.getByText("Easy")).toBeInTheDocument();
  });

  it("renders Medium for mid difficulty", () => {
    render(<ProblemDifficultyBadge difficulty={1500} />);

    expect(screen.getByText("Medium")).toBeInTheDocument();
  });

  it("renders Hard for high difficulty", () => {
    render(<ProblemDifficultyBadge difficulty={2500} />);

    expect(screen.getByText("Hard")).toBeInTheDocument();
  });

  it("renders Badge component with data-slot attribute", () => {
    render(<ProblemDifficultyBadge difficulty={3} />);

    const badge = screen.getByText("Easy");
    expect(badge).toHaveAttribute("data-slot", "badge");
  });

  it("renders Easy for negative difficulty values", () => {
    render(<ProblemDifficultyBadge difficulty={-1} />);

    expect(screen.getByText("Easy")).toBeInTheDocument();
  });
});
