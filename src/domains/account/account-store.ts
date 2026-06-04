import { User } from "@auth0/nextjs-auth0/types";
import { Account } from "./models/account";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

type AccountState = {
  account: Account | null;
};

type AccountActions = {
  init: (user: User) => void;
};

export type AccountStore = AccountState & AccountActions;

export const accountStore = create<AccountStore>()(
  devtools(
    subscribeWithSelector((set) => ({
      account: null,
      init: (user: User) => {
        set({ account: use });
      },
    }))
  )
);
