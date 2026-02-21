import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import AccountVerificationBanner from "./account-verification-banner";
import { useAccount, AuthStatus } from "../account.context";

vi.mock("../account.context");

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("AccountVerificationBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when authStatus is FULLY_AUTHENTICATED", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.FULLY_AUTHENTICATED,
      error: null,
    });

    const { container } = render(<AccountVerificationBanner />);

    expect(container.firstChild).toBeNull();
  });

  it("returns null when authStatus is UNAUTHENTICATED", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.UNAUTHENTICATED,
      error: null,
    });

    const { container } = render(<AccountVerificationBanner />);

    expect(container.firstChild).toBeNull();
  });

  it("returns null when PARTIALLY_AUTHENTICATED but no 404 error", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.PARTIALLY_AUTHENTICATED,
      error: { message: "Some other error" },
    });

    const { container } = render(<AccountVerificationBanner />);

    expect(container.firstChild).toBeNull();
  });

  it("shows banner when PARTIALLY_AUTHENTICATED with 404 error", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.PARTIALLY_AUTHENTICATED,
      error: { message: "Request failed with status code 404" },
    });

    render(<AccountVerificationBanner />);

    expect(
      screen.getByText(/Please finish setting up your account/i)
    ).toBeInTheDocument();
  });

  it("renders Complete Setup link", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.PARTIALLY_AUTHENTICATED,
      error: { message: "404 Not Found" },
    });

    render(<AccountVerificationBanner />);

    const link = screen.getByRole("link", { name: "Complete Setup" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/account/setup");
  });

  it("renders close button", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.PARTIALLY_AUTHENTICATED,
      error: { message: "404 error" },
    });

    render(<AccountVerificationBanner />);

    expect(
      screen.getByRole("button", { name: "Close banner" })
    ).toBeInTheDocument();
  });

  it("hides banner when close button is clicked", async () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.PARTIALLY_AUTHENTICATED,
      error: { message: "404 error" },
    });
    const user = userEvent.setup();

    render(<AccountVerificationBanner />);

    const closeButton = screen.getByRole("button", { name: "Close banner" });
    await user.click(closeButton);

    expect(
      screen.queryByText(/Please finish setting up your account/i)
    ).not.toBeInTheDocument();
  });

  it("returns null when error is null", () => {
    (useAccount as Mock).mockReturnValue({
      authStatus: AuthStatus.PARTIALLY_AUTHENTICATED,
      error: null,
    });

    const { container } = render(<AccountVerificationBanner />);

    expect(container.firstChild).toBeNull();
  });
});
