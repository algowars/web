import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi} from "vitest";
import SettingsLayout from "./layout";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn().mockReturnValue("/settings"),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/layouts/sidebar-layout/sidebar-layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-layout">{children}</div>
  ),
}));

describe("SettingsLayout", () => {
  it("renders children", () => {
    render(
      <SettingsLayout>
        <div data-testid="child">Child content</div>
      </SettingsLayout>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(
      <SettingsLayout>
        <div>Content</div>
      </SettingsLayout>
    );

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Preferences")).toBeInTheDocument();
  });

  it("renders Settings title", () => {
    render(
      <SettingsLayout>
        <div>Content</div>
      </SettingsLayout>
    );

    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders profile link with correct href", () => {
    render(
      <SettingsLayout>
        <div>Content</div>
      </SettingsLayout>
    );

    const link = screen.getByRole("link", { name: /Profile/i });
    expect(link).toHaveAttribute("href", "/settings/profile");
  });

  it("renders account link with correct href", () => {
    render(
      <SettingsLayout>
        <div>Content</div>
      </SettingsLayout>
    );

    const link = screen.getByRole("link", { name: /Account/i });
    expect(link).toHaveAttribute("href", "/settings/account");
  });

  it("renders preferences link with correct href", () => {
    render(
      <SettingsLayout>
        <div>Content</div>
      </SettingsLayout>
    );

    const link = screen.getByRole("link", { name: /Preferences/i });
    expect(link).toHaveAttribute("href", "/settings/preferences");
  });
});
