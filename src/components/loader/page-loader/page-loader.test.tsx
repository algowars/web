import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PageLoader from "./page-loader";

describe("PageLoader", () => {
  it("renders the loader container", () => {
    const { container } = render(<PageLoader />);

    expect(container.firstChild).toHaveClass("fixed", "inset-0", "z-50");
  });

  it("renders the spinner animation", () => {
    const { container } = render(<PageLoader />);

    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("does not show message when not provided", () => {
    render(<PageLoader />);

    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  it("shows message when provided", () => {
    render(<PageLoader message="Loading data..." />);

    expect(screen.getByText("Loading data...")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<PageLoader className="custom-loader" />);

    expect(container.firstChild).toHaveClass("custom-loader");
  });

  it("has backdrop blur styling", () => {
    const { container } = render(<PageLoader />);

    expect(container.firstChild).toHaveClass("backdrop-blur-sm");
  });

  it("renders centered content", () => {
    const { container } = render(<PageLoader />);

    expect(container.firstChild).toHaveClass("flex", "items-center", "justify-center");
  });

  it("message has animation class", () => {
    render(<PageLoader message="Test message" />);

    const message = screen.getByText("Test message");
    expect(message).toHaveClass("animate-pulse");
  });
});
