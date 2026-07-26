import { createAction } from "@reduxjs/toolkit";

export const HealthEvents = {
  loadHealthRequested: createAction("health/loadHealthRequested"),
  loadHealthSuccess: createAction<{ status: string; timestamp: string }>(
    "health/loadHealthSuccess"
  ),
  loadHealthFailure: createAction<{ message: string }>(
    "health/loadHealthFailure"
  ),
};
