import { ProfileSettings } from "@/lib/models/profile-settings";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

type SettingsState = {
  settings: ProfileSettings | null;
  profileIsEditing: boolean;
  accountIsEditing: boolean;
};

type SettingsActions = {
  initSettings: (settings: ProfileSettings) => void;
  beginProfileEditing: () => void;
  stopProfileEditing: () => void;
  beginAccountEditing: () => void;
  stopAccountEditing: () => void;
};

type SettingsStore = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
  subscribeWithSelector(
    devtools((set) => ({
      settings: null,
      profileIsEditing: false,
      accountIsEditing: false,

      initSettings: (settings: ProfileSettings) => set({ settings }),
      beginProfileEditing: () => set({ profileIsEditing: true }),
      stopProfileEditing: () => set({ profileIsEditing: false }),
      beginAccountEditing: () => set({ accountIsEditing: true }),
      stopAccountEditing: () => set({ accountIsEditing: false }),
    }))
  )
);
