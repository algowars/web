import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PartiallyAuthenticatedAccount } from "./partially-authenticated-account";

vi.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card">{children}</div>
  ),
  CardContent: ({
    children,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div data-testid="card-content">{children}</div>,
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="card-description">{children}</p>
  ),
  CardHeader: ({
    children,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h3 data-testid="card-title">{children}</h3>
  ),
}));

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
    <a href={href} className={className} data-testid="setup-link">
      {children}
    </a>
  ),
}));

vi.mock("@/features/auth/auth-logout/auth-logout", () => ({
  default: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <button data-testid="logout-button" className={className}>
      {children}
    </button>
  ),
}));

describe("PartiallyAuthenticatedAccount", () => {
  it("renders the card", () => {
    render(<PartiallyAuthenticatedAccount />);

    expect(screen.getByTestId("card")).toBeInTheDocument();
  });

  it("renders Finish account setup title", () => {
    render(<PartiallyAuthenticatedAccount />);

    expect(screen.getByTestId("card-title")).toHaveTextContent(
      "Finish account setup"
    );
  });

  it("renders default message", () => {
    render(<PartiallyAuthenticatedAccount />);

    expect(screen.getByTestId("card-description")).toHaveTextContent(
      "Please finish setting up your account to continue."
    );
  });

  it("renders custom message", () => {
    render(<PartiallyAuthenticatedAccount message="Custom setup message" />);

    expect(screen.getByTestId("card-description")).toHaveTextContent(
      "Custom setup message"
    );
  });

  it("renders setup link with default text", () => {
    render(<PartiallyAuthenticatedAccount />);

    const link = screen.getByTestId("setup-link");
    expect(link).toHaveTextContent("Complete account setup");
    expect(link).toHaveAttribute("href", "/account/setup");
  });

  it("renders setup link with custom text", () => {
    render(<PartiallyAuthenticatedAccount ctaText="Finish Setup" />);

    expect(screen.getByTestId("setup-link")).toHaveTextContent("Finish Setup");
  });

  it("renders logout button", () => {
    render(<PartiallyAuthenticatedAccount />);

    expect(screen.getByTestId("logout-button")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });
});
