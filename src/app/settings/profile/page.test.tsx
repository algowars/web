import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SettingsProfilePage from "./page";

vi.mock("@/features/settings/profile-settings/profile-settings", () => ({
  default: () => <div data-testid="profile-settings">ProfileSettings</div>,
}));

vi.mock(
  "@/features/settings/profile-settings/profile-settings-loading",
  () => ({
    default: () => <div data-testid="profile-settings-loading">Loading...</div>,
  })
);

describe("SettingsProfilePage", () => {
  it("can be initialized", () => {
    expect(SettingsProfilePage).toBeDefined();
  });

  it("renders ProfileSettings inside Suspense", () => {
    render(<SettingsProfilePage />);
    expect(screen.getByTestId("profile-settings")).toBeInTheDocument();
  });
});
