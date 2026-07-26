import { PageResult } from "@/shared/pagination/page-result";
import { createAction } from "@reduxjs/toolkit";
import { ProblemSubmission } from "../models/problem-submission";
import { SubmissionOrderByType } from "../models/submission-order-by-type";
import { SubmissionFilterType } from "../models/submission-filter-type";

export const ProblemSubmissionsEvents = {
  loadSubmissionsRequested: createAction<{
    slug: string;
    page: number;
    size: number;
    timestamp: string;
    type?: SubmissionFilterType;
    sortBy?: SubmissionOrderByType;
  }>("problem-submissions/loadSubmissionsRequested"),
  loadSubmissionsSuccess: createAction<PageResult<ProblemSubmission>>(
    "problem-submissions/loadSubmissionsSuccess"
  ),
  loadSubmissionsFailure: createAction<{ message: string }>(
    "problem-submissions/loadSubmissionsFailure"
  ),
  loadMoreSubmissionsRequested: createAction<{ slug: string }>(
    "problem-submissions/loadMoreSubmissionsRequested"
  ),
  loadMoreSubmissionsSuccess: createAction<PageResult<ProblemSubmission>>(
    "problem-submissions/loadMoreSubmissionsSuccess"
  ),
  loadMoreSubmissionsFailure: createAction<{ message: string }>(
    "problem-submissions/loadMoreSubmissionsFailure"
  ),
  changeFilterType: createAction<{
    type: SubmissionFilterType;
  }>("problem-submissions/changeFilterType"),
  changeSortBy: createAction<{
    sortBy: SubmissionOrderByType;
  }>("problem-submissions/changeSortBy"),
};
