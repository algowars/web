import { describe, it, expect } from "vitest";
import SettingsAccountPage from "./page";
import AccountSettings from "@/features/settings/account-settings/account-settings";

vi.mock("@/features/settings/account-settings/account-settings", () => ({
  default: () => <div data-testid="account-settings">AccountSettings</div>,
}));

describe("SettingsAccountPage", () => {
  it("can be initialized", () => {
    expect(SettingsAccountPage).toBeDefined();
  });

  it("renders AccountSettings component", () => {
    const result = SettingsAccountPage();
    expect(result).toEqual(<AccountSettings />);
  });
});
