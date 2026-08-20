import { createAction } from "@reduxjs/toolkit";
import type { Problem } from "../models/problem";

export const ProblemEvents = {
  initializeProblem: createAction<Problem>("problem/initialize"),
  clearProblem: createAction("problem/clear"),
};
