import { create } from "zustand";
import { ProfileSettings } from "../profile/models/profile-settings";
import { devtools, subscribeWithSelector } from "zustand/middleware";

type ProfileSettingsState = {
  profile: ProfileSettings | null;
  isEditing: boolean;
};

type ProfileSettingsActions = {
  initProfile: (profile: ProfileSettings) => void;
  beginEditing: () => void;
  stopEditing: () => void;
};

type ProfileSettingsStore = ProfileSettingsState & ProfileSettingsActions;

export const useProfileSettingsStore = create<ProfileSettingsStore>()(
  subscribeWithSelector(
    devtools((set) => ({
      profile: null,
      isEditing: false,

      initProfile: (profile: ProfileSettings) => set({ profile }),
      beginEditing: () => set({ isEditing: true }),
      stopEditing: () => set({ isEditing: false }),
    }))
  )
);

