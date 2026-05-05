import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SubmissionStatusBadge from "./submission-status-badge";
import { SubmissionStatus } from "@/features/problem/models/submission-status";

describe("SubmissionStatusBadge", () => {
  it("renders 'Accepted' label for ACCEPTED status", () => {
    render(<SubmissionStatusBadge status={SubmissionStatus.ACCEPTED} />);

    expect(screen.getByText("Accepted")).toBeInTheDocument();
  });

  it("renders 'Wrong Answer' label for WRONG_ANSWER status", () => {
    render(<SubmissionStatusBadge status={SubmissionStatus.WRONG_ANSWER} />);

    expect(screen.getByText("Wrong Answer")).toBeInTheDocument();
  });

  it("renders raw status string for unmapped status (PENDING)", () => {
    render(<SubmissionStatusBadge status={SubmissionStatus.PENDING} />);

    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <SubmissionStatusBadge
        status={SubmissionStatus.ACCEPTED}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders an icon for ACCEPTED status", () => {
    const { container } = render(
      <SubmissionStatusBadge status={SubmissionStatus.ACCEPTED} />
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders an icon for WRONG_ANSWER status", () => {
    const { container } = render(
      <SubmissionStatusBadge status={SubmissionStatus.WRONG_ANSWER} />
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("does not render an icon for unmapped status", () => {
    const { container } = render(
      <SubmissionStatusBadge status={SubmissionStatus.PENDING} />
    );

    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });
});
