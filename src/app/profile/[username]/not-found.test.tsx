import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProfileNotFound from "./not-found";

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

describe("ProfileNotFound", () => {
  it("renders the 'Profile not found' heading", () => {
    render(<ProfileNotFound />);
    expect(screen.getByText("Profile not found")).toBeInTheDocument();
  });

  it("renders the descriptive message", () => {
    render(<ProfileNotFound />);
    expect(
      screen.getByText("We couldn't find the profile you were looking for.")
    ).toBeInTheDocument();
  });

  it("renders the 'Return Home' link", () => {
    render(<ProfileNotFound />);
    expect(
      screen.getByRole("link", { name: "Return Home" })
    ).toBeInTheDocument();
  });

  it("Return Home link points to home route", () => {
    render(<ProfileNotFound />);
    expect(screen.getByRole("link", { name: "Return Home" })).toHaveAttribute(
      "href",
      "/"
    );
  });

  it("renders without crashing", () => {
    const { container } = render(<ProfileNotFound />);
    expect(container.firstChild).not.toBeNull();
  });
});
