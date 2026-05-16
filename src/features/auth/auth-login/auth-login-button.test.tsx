import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AuthLoginButton from "./auth-login-button";

vi.mock("next/navigation", () => ({
  usePathname: () => "/problems/two-sum/submissions",
  useSearchParams: () => new URLSearchParams("tab=all"),
}));

vi.mock("@/router-config", () => ({
  routerConfig: {
    authLogIn: { path: "/auth/login" },
  },
}));

describe("AuthLoginButton", () => {
  it("renders an anchor element", () => {
    render(<AuthLoginButton />);

    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("has correct href for login", () => {
    render(<AuthLoginButton />);

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/auth/login?returnTo=%2Fproblems%2Ftwo-sum%2Fsubmissions%3Ftab%3Dall"
    );
  });

  it("renders children content", () => {
    render(<AuthLoginButton>Log in</AuthLoginButton>);

    expect(screen.getByRole("link", { name: "Log in" })).toBeInTheDocument();
  });

  it("passes additional props to anchor element", () => {
    render(
      <AuthLoginButton className="test-class" data-testid="login-btn">
        Login
      </AuthLoginButton>
    );

    const link = screen.getByTestId("login-btn");
    expect(link).toHaveClass("test-class");
  });

  it("accepts variant props", () => {
    render(<AuthLoginButton variant="outline">Login</AuthLoginButton>);

    expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
  });
});
