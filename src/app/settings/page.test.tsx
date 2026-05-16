import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SettingsPage from "./page";

vi.mock("@/features/settings/account-settings/account-settings", () => ({
  default: () => <div data-testid="account-settings">AccountSettings</div>,
}));

vi.mock(
  "@/features/settings/account-settings/account-settings-loading",
  () => ({
    default: () => <div data-testid="account-settings-loading">Loading...</div>,
  })
);

describe("SettingsPage", () => {
  it("can be initialized", () => {
    expect(SettingsPage).toBeDefined();
  });

  it("renders AccountSettings inside Suspense", () => {
    render(<SettingsPage />);
    expect(screen.getByTestId("account-settings")).toBeInTheDocument();
  });
});
