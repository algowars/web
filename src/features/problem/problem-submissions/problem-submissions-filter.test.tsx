import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProblemSubmissionsFilter from "./problem-submissions-filter";
import { useProblemSubmissionsStore } from "./problem-submissions-store";
import { ProblemSubmissionsOptions } from "./problem-submissions-options";

describe("ProblemSubmissionsFilter", () => {
  beforeEach(() => {
    act(() => {
      useProblemSubmissionsStore.setState({
        filterOption: ProblemSubmissionsOptions.ALL_SOLUTIONS,
        submissions: [],
        page: 1,
        hasMore: true,
      });
    });
  });

  it("renders the Filter heading", () => {
    render(<ProblemSubmissionsFilter />);

    expect(screen.getByText("Filter")).toBeInTheDocument();
  });

  it("renders All Solutions radio option", () => {
    render(<ProblemSubmissionsFilter />);

    expect(screen.getByLabelText("All Solutions")).toBeInTheDocument();
  });

  it("renders My Submissions radio option", () => {
    render(<ProblemSubmissionsFilter />);

    expect(screen.getByLabelText("My Submissions")).toBeInTheDocument();
  });

  it("has All Solutions selected by default", () => {
    render(<ProblemSubmissionsFilter />);

    expect(screen.getByLabelText("All Solutions")).toBeChecked();
  });

  it("has My Submissions selected when store filterOption is MY_SUBMISSIONS", () => {
    act(() => {
      useProblemSubmissionsStore.setState({
        filterOption: ProblemSubmissionsOptions.MY_SUBMISSIONS,
      });
    });

    render(<ProblemSubmissionsFilter />);

    expect(screen.getByLabelText("My Submissions")).toBeChecked();
  });

  it("calls changeFilterOption with MY_SUBMISSIONS when My Submissions is clicked", async () => {
    const user = userEvent.setup();
    render(<ProblemSubmissionsFilter />);

    await user.click(screen.getByLabelText("My Submissions"));

    expect(useProblemSubmissionsStore.getState().filterOption).toBe(
      ProblemSubmissionsOptions.MY_SUBMISSIONS
    );
  });

  it("calls changeFilterOption with ALL_SOLUTIONS when All Solutions is clicked", async () => {
    act(() => {
      useProblemSubmissionsStore.setState({
        filterOption: ProblemSubmissionsOptions.MY_SUBMISSIONS,
      });
    });

    const user = userEvent.setup();
    render(<ProblemSubmissionsFilter />);

    await user.click(screen.getByLabelText("All Solutions"));

    expect(useProblemSubmissionsStore.getState().filterOption).toBe(
      ProblemSubmissionsOptions.ALL_SOLUTIONS
    );
  });
});
