import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { ThemeProvider } from "./theme-provider";

const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

let originalMatchMedia: typeof window.matchMedia;

beforeAll(() => {
  originalMatchMedia = window.matchMedia;
  window.matchMedia = mockMatchMedia;
});

afterAll(() => {
  window.matchMedia = originalMatchMedia;
});

describe("ThemeProvider", () => {
  it("renders children", () => {
    render(
      <ThemeProvider>
        <div>Child content</div>
      </ThemeProvider>
    );

    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    render(
      <ThemeProvider>
        <div>First child</div>
        <div>Second child</div>
      </ThemeProvider>
    );

    expect(screen.getByText("First child")).toBeInTheDocument();
    expect(screen.getByText("Second child")).toBeInTheDocument();
  });

  it("passes props to NextThemesProvider", () => {
    // ThemeProvider passes all props through to NextThemesProvider
    // Test that it doesn't throw when receiving standard props
    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div>Content</div>
      </ThemeProvider>
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
