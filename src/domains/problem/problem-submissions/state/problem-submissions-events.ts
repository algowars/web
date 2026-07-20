import { PageResult } from "@/shared/pagination/page-result";
import { createAction } from "@reduxjs/toolkit";
import { ProblemSubmission } from "../models/problem-submission";

export const ProblemSubmissionsEvents = {
  loadSubmissionsRequested: createAction<{ problemId: string }>(
    "problem-submissions/loadSubmissionsRequested"
  ),
  loadSubmissionsSuccess: createAction<PageResult<ProblemSubmission>>(
    "problem-submissions/loadSubmissionsSuccess"
  ),
  loadSubmissionsFailure: createAction<{ message: string }>(
    "problem-submissions/loadSubmissionsFailure"
  ),
};
