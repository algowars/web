import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

type ProblemsState = {
  page: number;
  size: number;
  timestamp: Date;
};

type ProblemsAsctions = {
  changePage: (page: number) => void;
  changeSize: (size: number) => void;
  changeTimestamp: (timestamp: Date) => void;
};

export type ProblemsStore = ProblemsState & ProblemsAsctions;

export const useProblemsStore = create<ProblemsStore>()(
  subscribeWithSelector(
    devtools((set) => ({
      page: 1,
      size: 20,
      timestamp: new Date(),
      changePage: (page) => set({ page }),
      changeSize: (size) => set({ size }),
      changeTimestamp: (timestamp) => set({ timestamp }),
    }))
  )
);
