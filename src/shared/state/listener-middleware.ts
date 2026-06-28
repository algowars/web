import { AuthEvents } from "@/domains/auth/state/auth-events";
import { problemApi } from "@/domains/problem/api/problem-api";
import { ProblemEvents } from "@/domains/problem/state/problem-events";
import { ProblemSetupEvents } from "@/domains/problem/state/problem-setup-slice";
import { registerProblemListeners } from "@/domains/problem/state/problem-listeners";
import { userApi } from "@/domains/user/api/user-api";
import { UserEvents } from "@/domains/user/state/user-events";
import { createListenerMiddleware } from "@reduxjs/toolkit";
import { WorkspaceEvents } from "@/domains/workspace/state/workspace-events";
import type { AppDispatch, RootState } from "./store";

export const listenerMiddleware = createListenerMiddleware();

const startAppListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>();

registerProblemListeners(startAppListening);

const requestProblemSetup = async (
  listenerApi: Parameters<typeof startAppListening>[0]["effect"] extends (
    action: any,
    listenerApi: infer L,
    ...args: any[]
  ) => any
    ? L
    : never,
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

startAppListening({
  actionCreator: AuthEvents.userAuthenticated,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners();

    try {
      const sub = action.payload.user.sub;

      if (!sub) {
        throw new Error("Missing user subject in auth payload");
      }

      listenerApi.dispatch(UserEvents.upsertUserRequested({ sub }));
      await listenerApi
        .dispatch(userApi.endpoints.upsertUser.initiate({ sub }))
        .unwrap();
      listenerApi.dispatch(UserEvents.upsertUserSuccess());

      listenerApi.dispatch(UserEvents.initializeUser());
      const account = await listenerApi
        .dispatch(userApi.endpoints.getAccount.initiate())
        .unwrap();

      listenerApi.dispatch(UserEvents.initializeUserSuccess(account));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to sync user";
      listenerApi.dispatch(UserEvents.upsertUserFailure({ message }));
      listenerApi.dispatch(UserEvents.initializeUserFailure({ message }));
    }
  },
});

startAppListening({
  actionCreator: UserEvents.updateUsernameRequested,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners();

    try {
      const user = await listenerApi
        .dispatch(
          userApi.endpoints.updateUsername.initiate(action.payload.data)
        )
        .unwrap();

      listenerApi.dispatch(UserEvents.updateUsernameSuccess(user));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update username";
      listenerApi.dispatch(UserEvents.updateUsernameFailure({ message }));
    }
  },
});

startAppListening({
  actionCreator: AuthEvents.userUnauthenticated,
  effect: async (_, listenerApi) => {
    listenerApi.cancelActiveListeners();
    listenerApi.dispatch(UserEvents.loggedOut());
  },
});
