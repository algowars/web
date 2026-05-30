import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ModeToggle } from "./mode-toggle";

const mockSetTheme = vi.fn();

vi.mock("next-themes", () => ({
  useTheme: () => ({
    setTheme: mockSetTheme,
  }),
}));

describe("ModeToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders toggle button", () => {
    render(<ModeToggle />);

    expect(
      screen.getByRole("button", { name: "Toggle theme" })
    ).toBeInTheDocument();
  });

  it("opens dropdown on click", async () => {
    const user = userEvent.setup();
    render(<ModeToggle />);

    await user.click(screen.getByRole("button", { name: "Toggle theme" }));

    expect(screen.getByRole("menuitem", { name: "Light" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Dark" })).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "System" })
    ).toBeInTheDocument();
  });

  it("sets light theme when Light is clicked", async () => {
    const user = userEvent.setup();
    render(<ModeToggle />);

    await user.click(screen.getByRole("button", { name: "Toggle theme" }));
    await user.click(screen.getByRole("menuitem", { name: "Light" }));

    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("sets dark theme when Dark is clicked", async () => {
    const user = userEvent.setup();
    render(<ModeToggle />);

    await user.click(screen.getByRole("button", { name: "Toggle theme" }));
    await user.click(screen.getByRole("menuitem", { name: "Dark" }));

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("sets system theme when System is clicked", async () => {
    const user = userEvent.setup();
    render(<ModeToggle />);

    await user.click(screen.getByRole("button", { name: "Toggle theme" }));
    await user.click(screen.getByRole("menuitem", { name: "System" }));

    expect(mockSetTheme).toHaveBeenCalledWith("system");
  });

  it("has screen reader text", () => {
    render(<ModeToggle />);

    expect(screen.getByText("Toggle theme")).toHaveClass("sr-only");
  });

  it("applies passed props to button", () => {
    render(<ModeToggle data-testid="theme-toggle" />);

    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });
});
