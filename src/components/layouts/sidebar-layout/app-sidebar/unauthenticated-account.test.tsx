import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { UnauthenticatedAccount } from "./unauthenticated-account";

vi.mock("@/components/ui/card", () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div data-testid="card">{children}</div>,
  CardContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div data-testid="card-content">{children}</div>,
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="card-description">{children}</p>
  ),
  CardHeader: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h3 data-testid="card-title">{children}</h3>
  ),
}));

vi.mock("@/features/auth/auth-login/auth-login-button", () => ({
  default: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <button data-testid="login-button" className={className}>
      {children}
    </button>
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
    <button data-testid="signup-button" className={className}>
      {children}
    </button>
  ),
}));

describe("UnauthenticatedAccount", () => {
  it("renders the card", () => {
    render(<UnauthenticatedAccount />);

    expect(screen.getByTestId("card")).toBeInTheDocument();
  });

  it("renders Join Algowars title", () => {
    render(<UnauthenticatedAccount />);

    expect(screen.getByTestId("card-title")).toHaveTextContent("Join Algowars");
  });

  it("renders default message", () => {
    render(<UnauthenticatedAccount />);

    expect(screen.getByTestId("card-description")).toHaveTextContent(
      "Join the community to interact with this content"
    );
  });

  it("renders custom message", () => {
    render(<UnauthenticatedAccount message="Custom message text" />);

    expect(screen.getByTestId("card-description")).toHaveTextContent(
      "Custom message text"
    );
  });

  it("renders login button", () => {
    render(<UnauthenticatedAccount />);

    expect(screen.getByTestId("login-button")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("renders signup button", () => {
    render(<UnauthenticatedAccount />);

    expect(screen.getByTestId("signup-button")).toBeInTheDocument();
    expect(screen.getByText("Get Started")).toBeInTheDocument();
  });
});
