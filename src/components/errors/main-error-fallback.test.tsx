import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MainErrorFallback, MinimalErrorFallback } from "./main-error-fallback";

describe("MainErrorFallback", () => {
  const mockResetErrorBoundary = vi.fn();
  const mockError = new Error("Test error message");
  mockError.stack = "Error: Test error\n  at test.js:1:1";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("location", {
      reload: vi.fn(),
      href: "",
    });
  });

  it("renders the error title", () => {
    render(
      <MainErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
      />
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders the error description", () => {
    render(
      <MainErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
      />
    );

    expect(
      screen.getByText(/We encountered an unexpected error/i)
    ).toBeInTheDocument();
  });

  it("renders Try Again button", () => {
    render(
      <MainErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
      />
    );

    expect(screen.getByRole("button", { name: "Try Again" })).toBeInTheDocument();
  });

  it("renders Reload Page button", () => {
    render(
      <MainErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
      />
    );

    expect(
      screen.getByRole("button", { name: "Reload Page" })
    ).toBeInTheDocument();
  });

  it("renders Go Home button", () => {
    render(
      <MainErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
      />
    );

    expect(screen.getByRole("button", { name: "Go Home" })).toBeInTheDocument();
  });

  it("calls resetErrorBoundary when Try Again is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MainErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
      />
    );

    await user.click(screen.getByRole("button", { name: "Try Again" }));

    expect(mockResetErrorBoundary).toHaveBeenCalledTimes(1);
  });

  it("reloads page when Reload Page is clicked", async () => {
    const user = userEvent.setup();
    const mockReload = vi.fn();
    vi.stubGlobal("location", { reload: mockReload, href: "" });

    render(
      <MainErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
      />
    );

    await user.click(screen.getByRole("button", { name: "Reload Page" }));

    expect(mockReload).toHaveBeenCalled();
  });

  it("navigates home when Go Home is clicked", async () => {
    const user = userEvent.setup();
    const locationMock = { reload: vi.fn(), href: "" };
    vi.stubGlobal("location", locationMock);

    render(
      <MainErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
      />
    );

    await user.click(screen.getByRole("button", { name: "Go Home" }));

    expect(locationMock.href).toBe("/");
  });
});

describe("MinimalErrorFallback", () => {
  const mockResetErrorBoundary = vi.fn();
  const mockError = new Error("Test error");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders error title", () => {
    render(
      <MinimalErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
      />
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders error description", () => {
    render(
      <MinimalErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
      />
    );

    expect(screen.getByText("An unexpected error occurred")).toBeInTheDocument();
  });

  it("renders Try again button", () => {
    render(
      <MinimalErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
      />
    );

    expect(
      screen.getByRole("button", { name: "Try again" })
    ).toBeInTheDocument();
  });

  it("calls resetErrorBoundary when Try again is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MinimalErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
      />
    );

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(mockResetErrorBoundary).toHaveBeenCalledTimes(1);
  });
});
