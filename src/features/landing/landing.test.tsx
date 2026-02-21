import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Landing from "./landing";

vi.mock("@/components/layouts/landing-layout/landing-layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="landing-layout">{children}</div>
  ),
}));

vi.mock("./hero/hero", () => ({
  default: () => <div data-testid="hero">Hero Component</div>,
}));

describe("Landing", () => {
  it("renders LandingLayout", () => {
    render(<Landing />);

    expect(screen.getByTestId("landing-layout")).toBeInTheDocument();
  });

  it("renders Hero component inside layout", () => {
    render(<Landing />);

    expect(screen.getByTestId("hero")).toBeInTheDocument();
  });

  it("renders Hero as child of LandingLayout", () => {
    render(<Landing />);

    const layout = screen.getByTestId("landing-layout");
    const hero = screen.getByTestId("hero");

    expect(layout).toContainElement(hero);
  });
});
