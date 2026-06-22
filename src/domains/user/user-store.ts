import { User } from "./models/user";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

type UserState = {
  user: User | null;
  isUserLoading: boolean;
};

type UserActions = {
  init: (user: User) => void;
  setUserLoading: (isLoading: boolean) => void;
};

export type UserStore = UserState & UserActions;

export const userStore = create<UserStore>()(
  devtools(
    subscribeWithSelector((set) => ({
      user: null,
      isUserLoading: false,
      init: (user: User) => {
        set({ user });
      },
      setUserLoading: (isLoading: boolean) => {
        set({ isUserLoading: isLoading });
      },
    }))
  )
);
