import { toast } from "sonner";
import { healthApi } from "../api/health-api";
import { HealthEvents } from "./health-events";
import type { AppDispatch, RootState } from "@/shared/state/store";
import { TypedStartListening } from "@reduxjs/toolkit";

export const registerHealthListeners = (
  startAppListening: TypedStartListening<RootState, AppDispatch>
) => {
  startAppListening({
    actionCreator: HealthEvents.loadHealthRequested,
    effect: async (_action, listenerApi) => {
      const toastTimer = setTimeout(() => {
        toast.loading("Server is starting up. This may take up to a minute.", {
          id: "server-startup",
        });
      }, 5000);

      try {
        const response = await listenerApi
          .dispatch(healthApi.endpoints.getHealth.initiate())
          .unwrap();

        clearTimeout(toastTimer);
        toast.dismiss("server-startup");

        listenerApi.dispatch(
          HealthEvents.loadHealthSuccess({
            status: response.status,
            timestamp: response.timestamp,
          })
        );
      } catch {
        clearTimeout(toastTimer);
        toast.dismiss("server-startup");

        listenerApi.dispatch(
          HealthEvents.loadHealthFailure({
            message: "Failed to load health status",
          })
        );
      }
    },
  });
  startAppListening({
    actionCreator: HealthEvents.loadHealthFailure,
    effect: async (action, listenerApi) => {
      listenerApi.cancelActiveListeners();
    },
  });
};
