import { describe, it, expect } from "vitest";
import SettingsPage from "./page";
import AccountSettings from "@/features/settings/account-settings/account-settings";

vi.mock("@/features/settings/account-settings/account-settings", () => ({
  default: () => <div data-testid="account-settings">AccountSettings</div>,
}));

describe("SettingsPage", () => {
  it("can be initialized", () => {
    expect(SettingsPage).toBeDefined();
  });

  it("renders AccountSettings component", () => {
    const result = SettingsPage();
    expect(result).toEqual(<AccountSettings />);
  });
});
