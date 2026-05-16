import { describe, it, expect, beforeEach } from "vitest";
import { faker } from "@faker-js/faker";
import { useSettingsStore } from "./settings-store";
import { ProfileSettings } from "@/features/profile/models/profile-settings";

function makeSettings(
  overrides: Partial<ProfileSettings> = {}
): ProfileSettings {
  return {
    username: faker.internet.username(),
    bio: faker.lorem.sentence(),
    usernameLastChangedAt: null,
    ...overrides,
  };
}

describe("useSettingsStore", () => {
  beforeEach(() => {
    useSettingsStore.setState({
      settings: null,
      profileIsEditing: false,
      accountIsEditing: false,
    });
  });

  describe("initial state", () => {
    it("has null settings", () => {
      expect(useSettingsStore.getState().settings).toBeNull();
    });

    it("profileIsEditing is false", () => {
      expect(useSettingsStore.getState().profileIsEditing).toBe(false);
    });

    it("accountIsEditing is false", () => {
      expect(useSettingsStore.getState().accountIsEditing).toBe(false);
    });
  });

  describe("initSettings", () => {
    it("sets settings", () => {
      const settings = makeSettings();

      useSettingsStore.getState().initSettings(settings);

      expect(useSettingsStore.getState().settings).toEqual(settings);
    });

    it("sets username correctly", () => {
      const settings = makeSettings({ username: "testuser" });

      useSettingsStore.getState().initSettings(settings);

      expect(useSettingsStore.getState().settings?.username).toBe("testuser");
    });

    it("sets bio correctly", () => {
      const settings = makeSettings({ bio: "My bio" });

      useSettingsStore.getState().initSettings(settings);

      expect(useSettingsStore.getState().settings?.bio).toBe("My bio");
    });

    it("replaces existing settings", () => {
      const first = makeSettings({ username: "first" });
      const second = makeSettings({ username: "second" });

      useSettingsStore.getState().initSettings(first);
      useSettingsStore.getState().initSettings(second);

      expect(useSettingsStore.getState().settings?.username).toBe("second");
    });
  });

  describe("profile editing", () => {
    it("beginProfileEditing sets profileIsEditing to true", () => {
      useSettingsStore.getState().beginProfileEditing();

      expect(useSettingsStore.getState().profileIsEditing).toBe(true);
    });

    it("stopProfileEditing sets profileIsEditing to false", () => {
      useSettingsStore.getState().beginProfileEditing();
      useSettingsStore.getState().stopProfileEditing();

      expect(useSettingsStore.getState().profileIsEditing).toBe(false);
    });

    it("beginProfileEditing does not affect accountIsEditing", () => {
      useSettingsStore.getState().beginProfileEditing();

      expect(useSettingsStore.getState().accountIsEditing).toBe(false);
    });
  });

  describe("account editing", () => {
    it("beginAccountEditing sets accountIsEditing to true", () => {
      useSettingsStore.getState().beginAccountEditing();

      expect(useSettingsStore.getState().accountIsEditing).toBe(true);
    });

    it("stopAccountEditing sets accountIsEditing to false", () => {
      useSettingsStore.getState().beginAccountEditing();
      useSettingsStore.getState().stopAccountEditing();

      expect(useSettingsStore.getState().accountIsEditing).toBe(false);
    });

    it("beginAccountEditing does not affect profileIsEditing", () => {
      useSettingsStore.getState().beginAccountEditing();

      expect(useSettingsStore.getState().profileIsEditing).toBe(false);
    });
  });

  describe("state isolation between tests", () => {
    it("settings is null at the start of each test", () => {
      expect(useSettingsStore.getState().settings).toBeNull();
    });

    it("editing flags are false at the start of each test", () => {
      expect(useSettingsStore.getState().profileIsEditing).toBe(false);
      expect(useSettingsStore.getState().accountIsEditing).toBe(false);
    });
  });
});
