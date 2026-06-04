import { Account } from "./models/account";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

type AccountState = {
  account: Account | null;
};

type AccountActions = {
  init: (account: Account) => void;
};

export type AccountStore = AccountState & AccountActions;

export const accountStore = create<AccountStore>()(
  devtools(
    subscribeWithSelector((set) => ({
      account: null,
      init: (account: Account) => {
        set({ account });
      },
    }))
  )
);
