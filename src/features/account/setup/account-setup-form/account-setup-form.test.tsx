import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import AccountSetupForm from "./account-setup-form";
import { useAccount } from "@/features/auth/api/get-account";
import { useUpdateUsername } from "@/features/auth/api/update-username";
import { useRouter } from "next/navigation";

vi.mock("@/features/auth/api/get-account", () => ({
  useAccount: vi.fn(),
}));
vi.mock("@/features/auth/api/update-username", async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import("@/features/auth/api/update-username")
    >();
  return {
    ...actual,
    useUpdateUsername: vi.fn(),
  };
});
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
vi.mock("@/router-config", () => ({
  routerConfig: {
    home: { path: "/" },
    dashboard: { path: "/dashboard" },
  },
}));
vi.mock("@/features/account/account-store", () => ({
  accountStore: {
    getState: vi.fn(() => ({ init: vi.fn() })),
  },
}));

describe("AccountSetupForm", () => {
  const mockPush = vi.fn();
  const mockReplace = vi.fn();
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useRouter as Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });

    (useAccount as Mock).mockReturnValue({
      data: null,
    });

    (useUpdateUsername as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      error: null,
    });
  });

  it("renders the form with title and description", () => {
    render(<AccountSetupForm />);

    expect(
      screen.getByText("Finish setting up your account")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please fill out the required fields")
    ).toBeInTheDocument();
  });

  it("renders username input field", () => {
    render(<AccountSetupForm />);

    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your username")
    ).toBeInTheDocument();
  });

  it("renders setup account button", () => {
    render(<AccountSetupForm />);

    expect(
      screen.getByRole("button", { name: "Setup Account" })
    ).toBeInTheDocument();
  });

  it("button is disabled when form is invalid (empty username)", () => {
    render(<AccountSetupForm />);

    const button = screen.getByRole("button", { name: "Setup Account" });
    expect(button).toBeDisabled();
  });

  it("button is enabled when username is filled", async () => {
    const user = userEvent.setup();
    render(<AccountSetupForm />);

    const input = screen.getByPlaceholderText("Enter your username");
    await user.type(input, "testuser");

    const button = screen.getByRole("button", { name: "Setup Account" });
    await waitFor(() => {
      expect(button).toBeEnabled();
    });
  });

  it("button shows Loading... when mutation is pending", () => {
    (useUpdateUsername as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isError: false,
      error: null,
    });

    render(<AccountSetupForm />);

    expect(
      screen.getByRole("button", { name: "Loading..." })
    ).toBeInTheDocument();
  });

  it("input is disabled when mutation is pending", () => {
    (useUpdateUsername as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isError: false,
      error: null,
    });

    render(<AccountSetupForm />);

    const input = screen.getByPlaceholderText("Enter your username");
    expect(input).toBeDisabled();
  });

  it("shows error message when mutation fails", () => {
    (useUpdateUsername as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: true,
      error: { message: "Username already taken" },
    });

    render(<AccountSetupForm />);

    expect(screen.getByText("Username already taken")).toBeInTheDocument();
  });

  it("calls mutate with form data on submit", async () => {
    const user = userEvent.setup();
    render(<AccountSetupForm />);

    const input = screen.getByPlaceholderText("Enter your username");
    await user.type(input, "testuser");

    const button = screen.getByRole("button", { name: "Setup Account" });
    await user.click(button);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        data: { username: "testuser" },
      });
    });
  });

  it("applies custom className", () => {
    const { container } = render(<AccountSetupForm className="custom-class" />);

    expect(container.firstChild).toHaveClass("custom-class");
  });
});
