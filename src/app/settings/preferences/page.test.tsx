import { describe, it, expect } from "vitest";
import SettingsPreferencesPage from "./page";
import PreferencesSettings from "@/features/settings/preferences-settings/preferences-settings";

vi.mock("@/features/settings/preferences-settings/preferences-settings", () => ({
  default: () => <div data-testid="preferences-settings">PreferencesSettings</div>,
}));

describe("SettingsPreferencesPage", () => {
  it("can be initialized", () => {
    expect(SettingsPreferencesPage).toBeDefined();
  });

  it("renders PreferencesSettings component", () => {
    const result = SettingsPreferencesPage();
    expect(result).toEqual(<PreferencesSettings />);
  });
});
