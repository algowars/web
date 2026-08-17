import { GameActions } from "@/domains/game/state/game-actions";
import { submissionApi } from "@/domains/submission/api/submission-api";
import { AppDispatch, RootState } from "@/shared/state/store";
import { TypedStartListening } from "@reduxjs/toolkit";
import { WorkspaceEvents } from "./workspace-events";

type StartAppListening = TypedStartListening<RootState, AppDispatch>;

export const registerGameWorkspaceListeners = (
  startAppListening: StartAppListening
) => {
  startAppListening({
    actionCreator: GameActions.soloRushSubmissionStarted,
    effect: (_, listenerApi) => {
      listenerApi.dispatch(WorkspaceEvents.activeSubmissionChanged(null));
      listenerApi.dispatch(WorkspaceEvents.submissionRequestStateChanged(true));
    },
  });

  startAppListening({
    actionCreator: GameActions.soloRushSubmissionCreated,
    effect: ({ payload }, listenerApi) => {
      const { submissionId } = payload;
      listenerApi.dispatch(WorkspaceEvents.activeSubmissionChanged(submissionId));
      listenerApi.dispatch(
        WorkspaceEvents.editorTabActivated({ nodeId: "root", tabIndex: 3 })
      );
      listenerApi.dispatch(
        WorkspaceEvents.editorTabActivated({ nodeId: "root.1.1", tabIndex: 1 })
      );
      listenerApi.dispatch(
        submissionApi.endpoints.getSubmissionStatus.initiate(submissionId, {
          subscribe: false,
          forceRefetch: true,
        })
      );
    },
  });

  startAppListening({
    actionCreator: GameActions.soloRushSubmissionEnded,
    effect: (_, listenerApi) => {
      listenerApi.dispatch(WorkspaceEvents.submissionRequestStateChanged(false));
    },
  });
};
