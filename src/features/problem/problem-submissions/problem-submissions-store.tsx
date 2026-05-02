import { Problem } from "@/features/problems/models/problem";
import { Submission } from "../models/submission";
import { create } from "zustand/react";
import { devtools, subscribeWithSelector } from "zustand/middleware";

type ProblemSubmissionsState = {
  problem: Problem | null;
  submissions: Submission[];
  currentUserId?: string;
  filterMode: "all" | "mine";
};

type ProblemSubmissionsActions = {
  setProblem: (problem: Problem | null) => void;
  setSubmissions: (submissions: Submission[]) => void;
  setCurrentUserId: (userId: string | undefined) => void;
  setFilterMode: (mode: "all" | "mine") => void;
};

type ProblemSubmissionsStore = ProblemSubmissionsState &
  ProblemSubmissionsActions;

export const useProblemSubmissionsStore = create<ProblemSubmissionsStore>()(
  subscribeWithSelector(
    devtools((set) => ({
      problem: null,
      submissions: [],
      currentUserId: undefined,
      filterMode: "all",
      setProblem: (problem) => set({ problem }),
      setSubmissions: (submissions) => set({ submissions }),
      setCurrentUserId: (userId) => set({ currentUserId: userId }),
      setFilterMode: (mode) => set({ filterMode: mode }),
    }))
  )
);
