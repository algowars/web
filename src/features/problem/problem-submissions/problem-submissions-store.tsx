import { Problem } from "@/features/problems/models/problem";
import { Submission } from "../models/submission";
import { create } from "zustand/react";
import { devtools, subscribeWithSelector } from "zustand/middleware";

type ProblemSubmissionsState = {
  problem: Problem | null;
  submissions: Submission[];
};

type ProblemSubmissionsActions = {
  setProblem: (problem: Problem | null) => void;
  setSubmissions: (submissions: Submission[]) => void;
};

type ProblemSubmissionsStore = ProblemSubmissionsState &
  ProblemSubmissionsActions;

export const useProblemSubmissionsStore = create<ProblemSubmissionsStore>()(
  subscribeWithSelector(
    devtools((set, get) => ({
      problem: null,
      submissions: [],
      setProblem: (problem) => set({ problem }),
      setSubmissions: (submissions) => set({ submissions }),
    }))
  )
);
