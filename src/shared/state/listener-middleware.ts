import { AuthActions } from "@/domains/auth/state/auth-actions";
import { problemApi } from "@/domains/problem/api/problem-api";
import { ProblemEvents } from "@/domains/problem/state/problem-events";
import { ProblemSetupEvents } from "@/domains/problem/state/problem-setup-slice";
import { submissionApi } from "@/domains/submission/api/submission-api";
import { registerProblemListeners } from "@/domains/problem/state/problem-listeners";
import { userApi } from "@/domains/user/api/user-api";
import { UserEvents } from "@/domains/user/state/user-events";
import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { WorkspaceEvents } from "@/domains/workspace/state/workspace-events";
import { toast } from "sonner";
import type { AppDispatch, RootState } from "./store";
import { registerProblemSubmissionsListeners } from "@/domains/problem/problem-submissions/state/problem-submissions-listeners";
import { registerHealthListeners } from "@/domains/health/state/health-listeners";
import { registerGameListeners } from "@/domains/game/state/game-listeners";
import { registerGameModesListeners } from "@/domains/game/state/game-modes-listeners";

export const listenerMiddleware = createListenerMiddleware();

const startAppListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>();

type StartAppListening = typeof startAppListening;
type AppListenerEffect = NonNullable<
  Parameters<StartAppListening>[0]["effect"]
>;
type AppListenerApi = Parameters<AppListenerEffect>[1];

registerProblemListeners(startAppListening);

registerProblemSubmissionsListeners(startAppListening);

registerHealthListeners(startAppListening);

registerGameListeners(startAppListening);

registerGameModesListeners(startAppListening);

const requestProblemSetup = async (
  listenerApi: AppListenerApi,
  slug: string,
  languageVersionId: string
) => {
  const response = await listenerApi
    .dispatch(
      problemApi.endpoints.getProblemSetup.initiate({
        slug,
        languageVersionId,
      })
    )
    .unwrap();

  listenerApi.dispatch(
    ProblemSetupEvents.loadProblemSetupSuccess({
      setup: response,
      languageVersionId,
    })
  );
};

startAppListening({
  actionCreator: ProblemEvents.initializeProblem,
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState();
    const problem = state.problemSetup.currentProblem;
    const languageVersionId = state.workspace.selectedVersionId;

    if (!problem || !languageVersionId) {
      return;
    }

    listenerApi.dispatch(
      ProblemSetupEvents.loadProblemSetupRequested({
        slug: problem.slug,
        languageVersionId,
      })
    );

    try {
      await requestProblemSetup(listenerApi, problem.slug, languageVersionId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load problem setup";

      listenerApi.dispatch(
        ProblemSetupEvents.loadProblemSetupFailure({ message })
      );
    }
  },
});

startAppListening({
  actionCreator: WorkspaceEvents.selectedVersionChanged,
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState();
    const problem = state.problemSetup.currentProblem;
    const languageVersionId = state.workspace.selectedVersionId;

    if (!problem || !languageVersionId) {
      return;
    }

    listenerApi.dispatch(
      ProblemSetupEvents.loadProblemSetupRequested({
        slug: problem.slug,
        languageVersionId,
      })
    );

    try {
      await requestProblemSetup(listenerApi, problem.slug, languageVersionId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load problem setup";

      listenerApi.dispatch(
        ProblemSetupEvents.loadProblemSetupFailure({ message })
      );
    }
  },
});

const isRunOrSubmitRequested = isAnyOf(
  WorkspaceEvents.runCodeRequested,
  WorkspaceEvents.submitCodeRequested
);

// Run and submit share one listener registration (rather than two separate
// ones) specifically so cancelActiveListeners() below can cancel a
// still-in-flight Run when Submit is clicked (or vice versa), not just two
// clicks of the same button. With separate registrations, cancelActiveListeners
// only ever cancels other instances of *its own* listener, leaving a
// cross-button race unguarded.
startAppListening({
  matcher: isRunOrSubmitRequested,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners();

    const state = listenerApi.getState();
    const problemSetupId = state.problemSetup.setup?.id;
    const isRun = WorkspaceEvents.runCodeRequested.match(action);

    if (!problemSetupId) {
      toast.error("Problem setup is not ready yet");
      // The reducer already flipped isSubmittingSubmission to true and
      // cleared activeSubmissionId synchronously when the action was
      // dispatched; undo that here since we're bailing out without ever
      // actually starting a run/submission.
      listenerApi.dispatch(
        WorkspaceEvents.submissionRequestStateChanged(false)
      );
      return;
    }

    try {
      listenerApi.dispatch(
        WorkspaceEvents.editorTabActivated({ nodeId: "root", tabIndex: 3 })
      );
      listenerApi.dispatch(
        WorkspaceEvents.editorTabActivated({ nodeId: "root.1.1", tabIndex: 1 })
      );

      const submissionId = await listenerApi
        .dispatch(
          isRun
            ? submissionApi.endpoints.createRunSubmission.initiate({
                problemSetupId,
                code: state.workspace.code,
                customTestCases: undefined,
              })
            : submissionApi.endpoints.createGradeSubmission.initiate({
                problemSetupId,
                code: state.workspace.code,
              })
        )
        .unwrap();

      listenerApi.dispatch(
        WorkspaceEvents.activeSubmissionChanged(submissionId)
      );

      listenerApi.dispatch(
        submissionApi.endpoints.getSubmissionStatus.initiate(submissionId, {
          subscribe: false,
          forceRefetch: true,
        })
      );

      toast.success(isRun ? "Run started" : "Submission created");
    } catch (error) {
      let fallbackMessage = "Failed to submit solution";
      if (isRun) {
        fallbackMessage = "Failed to run solution";
      }

      const message = error instanceof Error ? error.message : fallbackMessage;
      toast.error(message);
    } finally {
      listenerApi.dispatch(
        WorkspaceEvents.submissionRequestStateChanged(false)
      );
    }
  },
});

const syncUser = async (
  sub: string | undefined,
  listenerApi: AppListenerApi
) => {
  if (!sub) {
    const message = "Missing user subject in auth payload";
    listenerApi.dispatch(UserEvents.upsertUserFailure({ message }));
    listenerApi.dispatch(UserEvents.initializeUserFailure({ message }));
    return;
  }

  listenerApi.dispatch(UserEvents.upsertUserRequested({ sub }));

  // The PUT can fail transiently (e.g. the API is still cold-starting) without the
  // account itself being missing — it may already exist from a previous successful
  // upsert. So a failed PUT still falls through to GET rather than giving up outright;
  // only if both fail does the sidebar end up with no user to show.
  try {
    await listenerApi
      .dispatch(userApi.endpoints.upsertUser.initiate({ sub }))
      .unwrap();
    listenerApi.dispatch(UserEvents.upsertUserSuccess());
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to sync user";
    listenerApi.dispatch(UserEvents.upsertUserFailure({ message }));
  }

  listenerApi.dispatch(UserEvents.initializeUser());
  try {
    const account = await listenerApi
      .dispatch(
        userApi.endpoints.getAccount.initiate(undefined, { forceRefetch: true })
      )
      .unwrap();
    listenerApi.dispatch(UserEvents.initializeUserSuccess(account));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load your profile";
    listenerApi.dispatch(UserEvents.initializeUserFailure({ message }));
  }
};

startAppListening({
  actionCreator: AuthActions.userAuthenticated,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners();
    await syncUser(action.payload.user.sub, listenerApi);
  },
});

startAppListening({
  actionCreator: UserEvents.retrySyncRequested,
  effect: async (_action, listenerApi) => {
    listenerApi.cancelActiveListeners();
    const sub = listenerApi.getState().user.authProfile?.sub;
    await syncUser(sub, listenerApi);
  },
});

startAppListening({
  actionCreator: UserEvents.updateUsernameRequested,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners();

    try {
      await listenerApi
        .dispatch(
          userApi.endpoints.updateUsername.initiate(action.payload.data)
        )
        .unwrap();

      const account = await listenerApi
        .dispatch(userApi.endpoints.getAccount.initiate())
        .unwrap();

      listenerApi.dispatch(UserEvents.updateUsernameSuccess(account));
      toast.success("Username updated");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update username";
      listenerApi.dispatch(UserEvents.updateUsernameFailure({ message }));
    }
  },
});

startAppListening({
  actionCreator: AuthActions.userUnauthenticated,
  effect: async (_, listenerApi) => {
    listenerApi.cancelActiveListeners();
    listenerApi.dispatch(UserEvents.loggedOut());
  },
});

startAppListening({
  actionCreator: UserEvents.upsertUserFailure,
  effect: async (action) => {
    const message = action.payload.message;
    toast.error(message);
  },
});

startAppListening({
  actionCreator: ProblemSetupEvents.loadProblemSetupFailure,
  effect: async (action) => {
    const message = action.payload.message;
    toast.error(message);
  },
});
