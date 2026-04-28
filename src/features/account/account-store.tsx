import { create } from "zustand";
import { Account } from "../auth/models/account.model";
import { devtools, subscribeWithSelector } from "zustand/middleware";

type AccountState = {
  account: Account | null;
  isLoading: boolean;
};

type AccountActions = {
  init: (account: Account) => void;
  setLoading: (isLoading: boolean) => void;
};

export type AccountStore = AccountState & AccountActions;

export const accountStore = create<AccountStore>()(
  subscribeWithSelector(
    devtools((set) => ({
      account: null,
      isLoading: true,

      init: (account) => set({ account, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
    }))
  )
);
