import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NotFound from "./not-found";

vi.mock("@/features/problem/problem-not-found/problem-not-found", () => ({
  default: ({
    breadcrumbs,
  }: {
    breadcrumbs: { url: string; name: string }[];
  }) => (
    <div
      data-testid="problem-not-found"
      data-breadcrumbs={JSON.stringify(breadcrumbs)}
    />
  ),
}));

describe("SubmissionsNotFound", () => {
  it("renders ProblemNotFound component", () => {
    render(<NotFound />);

    expect(screen.getByTestId("problem-not-found")).toBeInTheDocument();
  });

  it("passes Home, Problems and Submissions breadcrumbs", () => {
    render(<NotFound />);

    const el = screen.getByTestId("problem-not-found");
    const breadcrumbs = JSON.parse(el.getAttribute("data-breadcrumbs") ?? "[]");
    expect(breadcrumbs).toHaveLength(3);
    expect(breadcrumbs[0].name).toBe("Home");
    expect(breadcrumbs[1].name).toBe("Problems");
    expect(breadcrumbs[2].name).toBe("Submissions");
  });
});
