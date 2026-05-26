import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Hero from "./hero";

vi.mock("@/features/auth/auth-login/auth-login-button", () => ({
  default: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <a data-testid="auth-login-button" className={className} href="/auth/login">
      {children}
    </a>
  ),
}));

vi.mock("@/features/auth/auth-signup/auth-signup-button", () => ({
  default: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <a
      data-testid="auth-signup-button"
      className={className}
      href="/auth/signup"
    >
      {children}
    </a>
  ),
}));

describe("Hero", () => {
  it("renders Log In and Join Today buttons", () => {
    render(<Hero />);
    expect(screen.getByText("Log In")).toBeInTheDocument();
    expect(screen.getByText("Join Today")).toBeInTheDocument();
  });

  it("renders AuthLoginButton with Log In text", () => {
    render(<Hero />);

    const loginButton = screen.getByTestId("auth-login-button");
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveTextContent("Log In");
  });

  it("renders AuthSignupButton with Join Today text", () => {
    render(<Hero />);

    const signupButton = screen.getByTestId("auth-signup-button");
    expect(signupButton).toBeInTheDocument();
    expect(signupButton).toHaveTextContent("Join Today");
  });

  it("renders section element", () => {
    const { container } = render(<Hero />);

    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("renders article element", () => {
    const { container } = render(<Hero />);

    const article = container.querySelector("article");
    expect(article).toBeInTheDocument();
  });

  it("renders list with two buttons", () => {
    render(<Hero />);

    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });

  it("renders heading with Fast-Paced Coding Challenges text", () => {
    render(<Hero />);

    expect(
      screen.getByText(/Fast-Paced Coding Challenges/i)
    ).toBeInTheDocument();
  });

  it("renders description about competing and collaborating", () => {
    render(<Hero />);

    expect(
      screen.getByText(/Compete with your peers, collaborate/i)
    ).toBeInTheDocument();
  });
});
