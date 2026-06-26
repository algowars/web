import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { Problem } from "../models/problem";

type ProblemsState = {
  page: number;
  size: number;
  timestamp: Date;
  problems: Problem[];
  isLoading: boolean;
};

type ProblemsActions = {
  changePage: (page: number) => void;
  changeSize: (size: number) => void;
  changeTimestamp: (timestamp: Date) => void;
  setProblems: (problems: Problem[]) => void;
  setIsLoading: (isLoading: boolean) => void;
};

export type ProblemsStore = ProblemsState & ProblemsActions;

export const useProblemsStore = create<ProblemsStore>()(
  subscribeWithSelector(
    devtools((set) => ({
      page: 1,
      size: 20,
      timestamp: new Date(),
      problems: [],
      isLoading: false,
      changePage: (page) => set({ page }),
      changeSize: (size) => set({ size }),
      changeTimestamp: (timestamp) => set({ timestamp }),
      setProblems: (problems) => set({ problems }),
      setIsLoading: (isLoading) => set({ isLoading }),
    }))
  )
);
