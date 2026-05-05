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
  filterOption: ProblemSubmissionsOptions;
  total: number;
  hasMore: boolean;
};

type ProblemSubmissionsActions = {
  initProblem: (problem: Problem) => void;
  changeFilterOption: (option: ProblemSubmissionsOptions) => void;
  setTotal: (total: number) => void;
  setHasMore: (hasMore: boolean) => void;
  setSubmissions: (submissions: ProblemSubmission[]) => void;
  addSubmissions: (submissions: ProblemSubmission[]) => void;
  incrementPage: () => void;
};

type ProblemSubmissionsStore = ProblemSubmissionsState &
  ProblemSubmissionsActions;

export const useProblemSubmissionsStore = create<ProblemSubmissionsStore>()(
  subscribeWithSelector(
    devtools((set) => ({
      problem: null,
      submissions: [],
      currentUserId: undefined,
      filterOption: ProblemSubmissionsOptions.ALL_SOLUTIONS,
      page: 1,
      size: 25,
      timestamp: new Date(),
      total: 0,
      hasMore: true,
      initProblem: (problem: Problem) => set({ problem }),
      changeFilterOption: (option: ProblemSubmissionsOptions) =>
        set({ filterOption: option, submissions: [], page: 1, hasMore: true }),
      setTotal: (total: number) => set({ total }),
      setHasMore: (hasMore: boolean) => set({ hasMore }),
      setSubmissions: (submissions: ProblemSubmission[]) =>
        set({ submissions }),
      addSubmissions: (newSubmissions: ProblemSubmission[]) =>
        set((state) => ({
          submissions: [...state.submissions, ...newSubmissions],
        })),
      incrementPage: () => set((state) => ({ page: state.page + 1 })),
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
    throw new Error("Problem required");
  }

  return useSuspenseProblemSolutions({
    problemId: problem.id,
    pagination: { page, size, timestamp },
    queryConfig,
  });
};
