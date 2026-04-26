import { create } from "zustand";
import { Account } from "../auth/models/account.model";
import { devtools, subscribeWithSelector } from "zustand/middleware";

type AccountState = {
  account: Account | null;
};

type AccountActions = {
  init: (account: Account) => void;
};

export type AccountStore = AccountState & AccountActions;

export const accountStore = create<AccountStore>()(
  subscribeWithSelector(
    devtools((set) => ({
      account: null,

      init: (account) => set({ account }),
    }))
  )
);
