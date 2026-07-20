import { AppDispatch, RootState } from "@/shared/state/store";
import { TypedStartListening } from "@reduxjs/toolkit";
import { ProblemSubmissionsEvents } from "./problem-submissions-events";

export const registerProblemSubmissionsListeners = (
  startAppListening: TypedStartListening<RootState, AppDispatch>
) => {
  startAppListening({
    actionCreator: ProblemSubmissionsEvents.loadSubmissionsRequested,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();

      try {
        
      }
    },
  });
};
