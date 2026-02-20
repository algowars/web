import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AuthSignupButton from "./auth-signup-button";

vi.mock("@/router-config", () => ({
  routerConfig: {
    authSignUp: {
      path: "/auth/login?screen_hint=signup&returnTo=/account/callback",
    },
  },
}));

describe("AuthSignupButton", () => {
  it("renders an anchor element", () => {
    render(<AuthSignupButton />);

    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("has correct href for signup", () => {
    render(<AuthSignupButton />);

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/auth/login?screen_hint=signup&returnTo=/account/callback"
    );
  });

  it("renders children content", () => {
    render(<AuthSignupButton>Sign up</AuthSignupButton>);

    expect(screen.getByRole("link", { name: "Sign up" })).toBeInTheDocument();
  });

  it("passes additional props to anchor element", () => {
    render(
      <AuthSignupButton className="signup-class" data-testid="signup-btn">
        Sign Up
      </AuthSignupButton>
    );

    const link = screen.getByTestId("signup-btn");
    expect(link).toHaveClass("signup-class");
  });
});
