import { create } from "zustand";
import { Problem } from "../models/problem";
import { devtools, subscribeWithSelector } from "zustand/middleware";

type ProblemState = {
  problem: Problem | null;
};

type ProblemActions = {
  initProblem: (problem: Problem) => void;
};

export type ProblemStore = ProblemState & ProblemActions;

export const useProblemStore = create<ProblemStore>()(
  subscribeWithSelector(
    devtools((set) => ({
      problem: null,
      initProblem: (problem) => set({ problem }),
    }))
  )
);
