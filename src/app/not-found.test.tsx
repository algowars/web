import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NotFound from "./not-found";

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

describe("NotFound", () => {
  it("renders page not found title", () => {
    render(<NotFound />);

    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<NotFound />);

    expect(
      screen.getByText(/find the page you were looking for/i)
    ).toBeInTheDocument();
  });

  it("renders help text", () => {
    render(<NotFound />);

    expect(
      screen.getByText("The link may be broken or the page may have been removed.")
    ).toBeInTheDocument();
  });

  it("renders Return Home link", () => {
    render(<NotFound />);

    const link = screen.getByRole("link", { name: "Return Home" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders error icon", () => {
    const { container } = render(<NotFound />);

    expect(container.querySelector(".lucide-circle-alert")).toBeInTheDocument();
  });

  it("renders as main element", () => {
    render(<NotFound />);

    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
