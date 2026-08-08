import { AppDispatch, RootState } from "@/shared/state/store";
import { TypedStartListening } from "@reduxjs/toolkit";
import { ProblemSubmissionsEvents } from "./problem-submissions-events";
import { problemSubmissionsApi } from "../api/problem-submissions-api";
import { selectHasMoreSubmissions } from "./problem-submissions-slice";

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

        const { filter } = listenerApi.getState().problemSubmissions;

        const response = await listenerApi
          .dispatch(
            problemSubmissionsApi.endpoints.getProblemSubmissions.initiate({
              ...action.payload,
              type: action.payload.type ?? filter.type,
              sortBy: action.payload.sortBy ?? filter.sortBy,
            })
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

  startAppListening({
    actionCreator: ProblemSubmissionsEvents.loadMoreSubmissionsRequested,
    effect: async (action, listenerApi) => {
      const state = listenerApi.getOriginalState();
      const slug = action.payload.slug;
      const {
        page,
        size,
        filter,
        isProblemSubmissionsLoading,
        isLoadingMoreSubmissions,
        timestamp,
      } = state.problemSubmissions;

      if (
        isProblemSubmissionsLoading ||
        isLoadingMoreSubmissions ||
        !selectHasMoreSubmissions(state)
      ) {
        return;
      }

      try {
        const response = await listenerApi
          .dispatch(
            problemSubmissionsApi.endpoints.getProblemSubmissions.initiate({
              slug,
              page: page + 1,
              size,
              type: filter.type,
              sortBy: filter.sortBy,
              timestamp,
            })
          )
          .unwrap();

        listenerApi.dispatch(
          ProblemSubmissionsEvents.loadMoreSubmissionsSuccess(response)
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load more problem submissions";
        listenerApi.dispatch(
          ProblemSubmissionsEvents.loadMoreSubmissionsFailure({ message })
        );
      }
    },
  });

  startAppListening({
    actionCreator: ProblemSubmissionsEvents.changeFilterType,
    effect: async (_action, listenerApi) => {
      const { slug, size } = listenerApi.getState().problemSubmissions;

      if (!slug) {
        return;
      }

      listenerApi.dispatch(
        ProblemSubmissionsEvents.loadSubmissionsRequested({
          slug,
          page: 1,
          size,
          timestamp: new Date().toISOString(),
        })
      );
    },
  });

  startAppListening({
    actionCreator: ProblemSubmissionsEvents.changeSortBy,
    effect: async (_action, listenerApi) => {
      const { slug, size } = listenerApi.getState().problemSubmissions;

      if (!slug) {
        return;
      }

      listenerApi.dispatch(
        ProblemSubmissionsEvents.loadSubmissionsRequested({
          slug,
          page: 1,
          size,
          timestamp: new Date().toISOString(),
        })
      );
    },
  });
};
