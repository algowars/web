import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProblemStatusBadge } from "./problem-status-badge";
import { ProblemStatus } from "@/features/problems/models/problem-status";

describe("ProblemStatusBadge", () => {
  it("renders 'Accepted' label for ACCEPTED status", () => {
    render(<ProblemStatusBadge status={ProblemStatus.ACCEPTED} />);

    expect(screen.getByText("Accepted")).toBeInTheDocument();
  });

  it("renders 'Attempted' label for PENDING status", () => {
    render(<ProblemStatusBadge status={ProblemStatus.PENDING} />);

    expect(screen.getByText("Attempted")).toBeInTheDocument();
  });

  it("renders 'Unattempted' label for REJECTED status", () => {
    render(<ProblemStatusBadge status={ProblemStatus.REJECTED} />);

    expect(screen.getByText("Unattempted")).toBeInTheDocument();
  });

  it("renders Badge element for ACCEPTED status", () => {
    render(<ProblemStatusBadge status={ProblemStatus.ACCEPTED} />);

    const badge = screen.getByText("Accepted");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-slot", "badge");
  });

  it("renders Badge element for PENDING status", () => {
    render(<ProblemStatusBadge status={ProblemStatus.PENDING} />);

    const badge = screen.getByText("Attempted");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-slot", "badge");
  });

  it("renders Badge element for REJECTED status", () => {
    render(<ProblemStatusBadge status={ProblemStatus.REJECTED} />);

    const badge = screen.getByText("Unattempted");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-slot", "badge");
  });

  it("renders fallback for unknown status", () => {
    const unknownStatus = "UnknownStatus" as ProblemStatus;
    render(<ProblemStatusBadge status={unknownStatus} />);

    expect(screen.getByText("UnknownStatus")).toBeInTheDocument();
  });
});
