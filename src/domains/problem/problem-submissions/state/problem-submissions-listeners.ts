import { AppDispatch, RootState } from "@/shared/state/store";
import { TypedStartListening } from "@reduxjs/toolkit";
import { ProblemSubmissionsEvents } from "./problem-submissions-events";
import { problemSubmissionsApi } from "../api/problem-submissions-api";

export const registerProblemSubmissionsListeners = (
  startAppListening: TypedStartListening<RootState, AppDispatch>
) => {
  startAppListening({
    actionCreator: ProblemSubmissionsEvents.loadSubmissionsRequested,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      try {
        if (action.payload.timestamp.trim() === "") {
          throw new Error("Missing or invalid timestamp in request payload");
        }

        const response = await listenerApi
          .dispatch(
            problemSubmissionsApi.endpoints.getProblemSubmissions.initiate(
              action.payload
            )
          )
          .unwrap();

        listenerApi.dispatch(
          ProblemSubmissionsEvents.loadSubmissionsSuccess(response)
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load problem submissions";

        listenerApi.dispatch(
          ProblemSubmissionsEvents.loadSubmissionsFailure({ message })
        );
      }
    },
  });
};
