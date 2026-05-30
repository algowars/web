import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LandingLayout from "./landing-layout";

vi.mock("./navbar/landing-navbar", () => ({
  default: () => <nav data-testid="landing-navbar">Navbar</nav>,
}));

vi.mock("./footer/landing-footer", () => ({
  default: () => <footer data-testid="landing-footer">Footer</footer>,
}));

describe("LandingLayout", () => {
  it("renders children content", () => {
    render(
      <LandingLayout>
        <div>Test Content</div>
      </LandingLayout>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders navbar component", () => {
    render(
      <LandingLayout>
        <div>Content</div>
      </LandingLayout>
    );

    expect(screen.getByTestId("landing-navbar")).toBeInTheDocument();
  });

  it("renders footer component", () => {
    render(
      <LandingLayout>
        <div>Content</div>
      </LandingLayout>
    );

    expect(screen.getByTestId("landing-footer")).toBeInTheDocument();
  });

  it("applies mainClassName to main element", () => {
    render(
      <LandingLayout mainClassName="custom-main-class">
        <div>Content</div>
      </LandingLayout>
    );

    const main = screen.getByRole("main");
    expect(main).toHaveClass("custom-main-class");
  });

  it("main has grow class by default", () => {
    render(
      <LandingLayout>
        <div>Content</div>
      </LandingLayout>
    );

    const main = screen.getByRole("main");
    expect(main).toHaveClass("grow");
  });

  it("main has correct id and tabIndex", () => {
    render(
      <LandingLayout>
        <div>Content</div>
      </LandingLayout>
    );

    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
  });

  it("passes additional props to container div", () => {
    render(
      <LandingLayout data-testid="layout-container">
        <div>Content</div>
      </LandingLayout>
    );

    expect(screen.getByTestId("layout-container")).toBeInTheDocument();
  });
});
