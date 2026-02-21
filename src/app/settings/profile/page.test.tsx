import { describe, it, expect } from "vitest";
import SettingsProfilePage from "./page";
import ProfileSettings from "@/features/settings/profile-settings/profile-settings";

vi.mock("@/features/settings/profile-settings/profile-settings", () => ({
  default: () => <div data-testid="profile-settings">ProfileSettings</div>,
}));

describe("SettingsProfilePage", () => {
  it("can be initialized", () => {
    expect(SettingsProfilePage).toBeDefined();
  });

  it("renders ProfileSettings component", () => {
    const result = SettingsProfilePage();
    expect(result).toEqual(<ProfileSettings />);
  });
});
