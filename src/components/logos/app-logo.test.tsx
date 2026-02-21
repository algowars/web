import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AppLogo from "./app-logo";

describe("AppLogo", () => {
  it("renders the logo text", () => {
    render(<AppLogo />);

    expect(screen.getByText("Algowars")).toBeInTheDocument();
  });

  it("renders as h1 heading", () => {
    render(<AppLogo />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("has uppercase styling", () => {
    render(<AppLogo />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveClass("uppercase");
  });

  it("has semibold font weight", () => {
    render(<AppLogo />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveClass("font-semibold");
  });
});
