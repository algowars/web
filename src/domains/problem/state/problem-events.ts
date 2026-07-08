import { createAction } from "@reduxjs/toolkit";
import type { Problem } from "../models/problem";
import type { ProblemSummary } from "../models/problem-summary";

export const ProblemEvents = {
  initializeProblem: createAction<Problem>("problem/initialize"),

  setProblemsPage: createAction<number>("problem/setPage"),
  setProblemsSize: createAction<number>("problem/setSize"),
  setProblemsTimestamp: createAction<string>("problem/setTimestamp"),

  loadProblemsRequested: createAction<{
    page: number;
    size: number;
    timestamp: string;
  }>("problem/loadProblemsRequested"),
  loadProblemsSuccess: createAction<{
    results: ProblemSummary[];
    total: number;
    page: number;
    size: number;
    timestamp: string;
  }>("problem/loadProblemsSuccess"),
  loadProblemsFailure: createAction<{ message: string }>(
    "problem/loadProblemsFailure"
  ),
};
