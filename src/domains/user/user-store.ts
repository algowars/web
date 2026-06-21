import { User } from "./models/user";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

type UserState = {
  user: User | null;
};

type UserActions = {
  init: (user: User) => void;
};

export type UserStore = UserState & UserActions;

export const userStore = create<UserStore>()(
  devtools(
    subscribeWithSelector((set) => ({
      user: null,
      init: (user: User) => {
        set({ user });
      },
    }))
  )
);
