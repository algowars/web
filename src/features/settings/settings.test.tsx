import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Settings from "./settings";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

import { usePathname } from "next/navigation";

const mockUsePathname = vi.mocked(usePathname);

describe("Settings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue("/settings");
  });

  it("renders the settings title", () => {
    render(<Settings />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders all navigation items", () => {
    render(<Settings />);

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Preferences")).toBeInTheDocument();
  });

  it("renders navigation links with correct hrefs", () => {
    render(<Settings />);

    expect(screen.getByRole("link", { name: /Profile/i })).toHaveAttribute(
      "href",
      "/settings/profile"
    );
    expect(screen.getByRole("link", { name: /Account/i })).toHaveAttribute(
      "href",
      "/settings/account"
    );
    expect(screen.getByRole("link", { name: /Preferences/i })).toHaveAttribute(
      "href",
      "/settings/preferences"
    );
  });

  it("renders default message when no children provided", () => {
    render(<Settings />);
    expect(
      screen.getByText("Select a setting from the sidebar.")
    ).toBeInTheDocument();
  });

  it("renders children when provided", () => {
    render(
      <Settings>
        <div>Test Child Content</div>
      </Settings>
    );

    expect(screen.getByText("Test Child Content")).toBeInTheDocument();
    expect(
      screen.queryByText("Select a setting from the sidebar.")
    ).not.toBeInTheDocument();
  });

  describe("active state", () => {
    it("applies active styles to Profile when on profile path", () => {
      mockUsePathname.mockReturnValue("/settings/profile");
      render(<Settings />);

      const profileLink = screen.getByRole("link", { name: /Profile/i });
      expect(profileLink).toHaveClass("bg-primary");
    });

    it("applies active styles to Account when on account path", () => {
      mockUsePathname.mockReturnValue("/settings/account");
      render(<Settings />);

      const accountLink = screen.getByRole("link", { name: /Account/i });
      expect(accountLink).toHaveClass("bg-primary");
    });

    it("applies active styles to Preferences when on preferences path", () => {
      mockUsePathname.mockReturnValue("/settings/preferences");
      render(<Settings />);

      const preferencesLink = screen.getByRole("link", {
        name: /Preferences/i,
      });
      expect(preferencesLink).toHaveClass("bg-primary");
    });

    it("applies active styles when on sub-path", () => {
      mockUsePathname.mockReturnValue("/settings/profile/edit");
      render(<Settings />);

      const profileLink = screen.getByRole("link", { name: /Profile/i });
      expect(profileLink).toHaveClass("bg-primary");
    });
  });
});
