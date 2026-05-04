import { Problem } from "@/features/problems/models/problem";
import { create } from "zustand/react";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { ProblemSubmissionsOptions } from "./problem-submissions-options";
import {
  useProblemSubmissions,
  useSuspenseProblemSubmissions,
  UseProblemSubmissionsOptions,
} from "../api/get-problem-submissions";
import {
  useProblemSolutions,
  useSuspenseProblemSolutions,
} from "../api/get-problem-solutions";
import { ProblemSubmission } from "../models/problem-submission";

type ProblemSubmissionsState = {
  problem: Problem | null;
  submissions: ProblemSubmission[];
  page: number;
  size: number;
  timestamp: Date;
  currentUserId?: string;
  filterOptions: ProblemSubmissionsOptions;
};

type ProblemSubmissionsActions = {
  initProblem: (problem: Problem) => void;
  changeFilterOption: (option: ProblemSubmissionsOptions) => void;
};

type ProblemSubmissionsStore = ProblemSubmissionsState &
  ProblemSubmissionsActions;

export const useProblemSubmissionsStore = create<ProblemSubmissionsStore>()(
  subscribeWithSelector(
    devtools((set) => ({
      problem: null,
      submissions: [],
      currentUserId: undefined,
      filterOptions: ProblemSubmissionsOptions,
      page: 1,
      size: 25,
      timtestamp: new Date(),
      initProblem: (problem: Problem) => set({ problem }),
    }))
  )
);

export const useProblemSubmissionsWithStore = (
  queryConfig?: UseProblemSubmissionsOptions["queryConfig"]
) => {
  const page = useProblemSubmissionsStore((s) => s.page);
  const size = useProblemSubmissionsStore((s) => s.size);
  const timestamp = useProblemSubmissionsStore((s) => s.timestamp);
  const problem = useProblemSubmissionsStore((s) => s.problem);

  if (!problem) {
    throw Error("Problem required");
  }

  return useProblemSubmissions({
    problemId: problem.id,
    pagination: {
      page,
      size,
      timestamp,
    },
    queryConfig,
  });
};

export const useProblemSolutionsWithStore = (
  queryConfig?: UseProblemSubmissionsOptions["queryConfig"]
) => {
  const page = useProblemSubmissionsStore((s) => s.page);
  const size = useProblemSubmissionsStore((s) => s.size);
  const timestamp = useProblemSubmissionsStore((s) => s.timestamp);
  const problem = useProblemSubmissionsStore((s) => s.problem);

  if (!problem) {
    throw Error("Problem required");
  }

  return useProblemSolutions({
    problemId: problem.id,
    pagination: {
      page,
      size,
      timestamp,
    },
    queryConfig,
  });
};

export const useSuspenseProblemSubmissionsWithStore = (
  queryConfig?: UseProblemSubmissionsOptions["queryConfig"]
) => {
  const page = useProblemSubmissionsStore((s) => s.page);
  const size = useProblemSubmissionsStore((s) => s.size);
  const timestamp = useProblemSubmissionsStore((s) => s.timestamp);
  const problem = useProblemSubmissionsStore((s) => s.problem);

  if (!problem) {
    throw Error("Problem required");
  }

  return useSuspenseProblemSubmissions({
    problemId: problem.id,
    pagination: { page, size, timestamp },
    queryConfig,
  });
};

export const useSuspenseProblemSolutionsWithStore = (
  queryConfig?: UseProblemSubmissionsOptions["queryConfig"]
) => {
  const page = useProblemSubmissionsStore((s) => s.page);
  const size = useProblemSubmissionsStore((s) => s.size);
  const timestamp = useProblemSubmissionsStore((s) => s.timestamp);
  const problem = useProblemSubmissionsStore((s) => s.problem);

  if (!problem) {
    throw Error("Problem required");
  }

  return useSuspenseProblemSolutions({
    problemId: problem.id,
    pagination: { page, size, timestamp },
    queryConfig,
  });
};
