import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SettingsAccountPage from "./page";

vi.mock("@/features/settings/account-settings/account-settings", () => ({
  default: () => <div data-testid="account-settings">AccountSettings</div>,
}));

vi.mock(
  "@/features/settings/account-settings/account-settings-loading",
  () => ({
    default: () => <div>Loading</div>,
  })
);

describe("SettingsAccountPage", () => {
  it("can be initialized", () => {
    expect(SettingsAccountPage).toBeDefined();
  });

  it("renders AccountSettings component", () => {
    render(<SettingsAccountPage />);
    expect(screen.getByTestId("account-settings")).toBeInTheDocument();
  });
});
