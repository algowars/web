import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProblemNotFound from "./problem-not-found";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/layouts/sidebar-layout/sidebar-layout", () => ({
  default: ({
    children,
    breadcrumbs,
  }: {
    children: React.ReactNode;
    breadcrumbs: { name: string; url: string }[];
  }) => (
    <div
      data-testid="sidebar-layout"
      data-breadcrumbs={JSON.stringify(breadcrumbs)}
    >
      {children}
    </div>
  ),
}));

describe("ProblemNotFound", () => {
  it("renders problem not found title", () => {
    render(<ProblemNotFound />);

    expect(screen.getByText("Problem not found")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<ProblemNotFound />);

    expect(
      screen.getByText(
        "The problem may have been removed or the link may be incorrect."
      )
    ).toBeInTheDocument();
  });

  it("renders Browse Problems link", () => {
    render(<ProblemNotFound />);

    const link = screen.getByRole("link", { name: "Browse Problems" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/problems");
  });

  it("renders with default breadcrumbs when none provided", () => {
    render(<ProblemNotFound />);

    const layout = screen.getByTestId("sidebar-layout");
    const breadcrumbs = JSON.parse(
      layout.getAttribute("data-breadcrumbs") ?? "[]"
    );
    expect(breadcrumbs).toHaveLength(2);
    expect(breadcrumbs[0].name).toBe("Home");
    expect(breadcrumbs[1].name).toBe("Problems");
  });

  it("renders with custom breadcrumbs when provided", () => {
    const customBreadcrumbs = [
      { url: "/", name: "Home" },
      { url: "/problems", name: "Problems" },
      { url: "#", name: "Submissions" },
    ];

    render(<ProblemNotFound breadcrumbs={customBreadcrumbs} />);

    const layout = screen.getByTestId("sidebar-layout");
    const breadcrumbs = JSON.parse(
      layout.getAttribute("data-breadcrumbs") ?? "[]"
    );
    expect(breadcrumbs).toHaveLength(3);
    expect(breadcrumbs[2].name).toBe("Submissions");
  });

  it("renders alert icon", () => {
    const { container } = render(<ProblemNotFound />);

    expect(container.querySelector(".lucide-circle-alert")).toBeInTheDocument();
  });
});
