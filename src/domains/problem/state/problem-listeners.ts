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

        // Trust the request's own timestamp over the response's: if the
        // backend doesn't echo `timestamp` back (or sends something falsy),
        // falling back here keeps state.timestamp a valid, non-empty string
        // instead of poisoning it with `undefined` for every render after.
        const timestamp =
          typeof response.timestamp === "string" && response.timestamp.trim() !== ""
            ? response.timestamp
            : action.payload.timestamp;

        listenerApi.dispatch(
          ProblemEvents.loadProblemsSuccess({
            results: response.results,
            total: response.total,
            page: response.page,
            size: response.size,
            timestamp,
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
