import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AuthLogout from "./auth-logout";

vi.mock("@/router-config", () => ({
  routerConfig: {
    authLogOut: { path: "/auth/logout" },
  },
}));

describe("AuthLogout", () => {
  it("renders an anchor element", () => {
    render(<AuthLogout />);

    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("has correct href for logout", () => {
    render(<AuthLogout />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/auth/logout");
  });

  it("renders children content", () => {
    render(<AuthLogout>Log out</AuthLogout>);

    expect(screen.getByRole("link", { name: "Log out" })).toBeInTheDocument();
  });

  it("passes additional props to anchor element", () => {
    render(
      <AuthLogout className="logout-class" data-testid="logout-btn">
        Logout
      </AuthLogout>
    );

    const link = screen.getByTestId("logout-btn");
    expect(link).toHaveClass("logout-class");
  });
});
