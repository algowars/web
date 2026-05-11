import { create } from "zustand";
import { Profile } from "./models/profile"
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { UseProfileOptions, useSuspenseProfile } from "./api/get-profile";

type ProfileState = {
    profile: Profile;
}

type ProfileActions = {
    setProfile: (profile: Profile) => void;
}

type ProfileStore = ProfileState & ProfileActions;

export const useProfileStore = create<ProfileStore>()(
    subscribeWithSelector(
        devtools((set) => ({
            profile: null,

            setProfile: (profile: Profile) => set({ profile})
        }))
    )
);

export const useProfileStoreWithQuery = (
    username: string,
    queryConfig?: UseProfileOptions["queryConfig"]
) => {
    return useSuspenseProfile({
        username,
        queryConfig
    });
}