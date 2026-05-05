import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProblemSubmissionsAlert from "./problem-submissions-alert";

describe("ProblemSubmissionsAlert", () => {
  it("renders the error title", () => {
    render(<ProblemSubmissionsAlert />);

    expect(screen.getByText("Error loading submissions")).toBeInTheDocument();
  });

  it("renders the default message when no error is provided", () => {
    render(<ProblemSubmissionsAlert />);

    expect(
      screen.getByText(
        "An unexpected error occurred while loading submissions."
      )
    ).toBeInTheDocument();
  });

  it("renders the error message when an error is provided", () => {
    const error = new Error("Network failure");

    render(<ProblemSubmissionsAlert error={error} />);

    expect(screen.getByText("Network failure")).toBeInTheDocument();
  });

  it("does not render default message when a specific error message is provided", () => {
    const error = new Error("Custom error message");

    render(<ProblemSubmissionsAlert error={error} />);

    expect(
      screen.queryByText(
        "An unexpected error occurred while loading submissions."
      )
    ).not.toBeInTheDocument();
  });

  it("passes extra props to the alert container", () => {
    render(
      <ProblemSubmissionsAlert className="col-span-12" data-testid="alert" />
    );

    expect(screen.getByTestId("alert")).toHaveClass("col-span-12");
  });
});
