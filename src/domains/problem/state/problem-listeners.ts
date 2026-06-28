import { problemApi } from "../api/problem-api";
import { ProblemEvents } from "./problem-events";
import type { AppDispatch, RootState } from "@/shared/state/store";
import type { TypedStartListening } from "@reduxjs/toolkit";

export const registerProblemListeners = (
  startAppListening: TypedStartListening<RootState, AppDispatch>
) => {
  startAppListening({
    actionCreator: ProblemEvents.loadProblemsRequested,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      try {
        if (action.payload.timestamp.trim() === "") {
          throw new Error("Missing or invalid timestamp in request payload");
        }

        const response = await listenerApi
          .dispatch(problemApi.endpoints.getProblems.initiate(action.payload))
          .unwrap();

        listenerApi.dispatch(
          ProblemEvents.loadProblemsSuccess({
            results: response.results,
            total: response.total,
            page: response.page,
            size: response.size,
            timestamp: response.timestamp,
          })
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load problems";

        listenerApi.dispatch(ProblemEvents.loadProblemsFailure({ message }));
      }
    },
  });
};
