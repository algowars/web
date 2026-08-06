import { userReducer } from "@/domains/user/state/user-slice";
import { problemReducer } from "@/domains/problem/state/problem-slice";
import { problemSetupReducer } from "@/domains/problem/state/problem-setup-slice";
import { workspaceReducer } from "@/domains/workspace/state/workspace-slice";
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../lib/base-api";
import { listenerMiddleware } from "./listener-middleware";
import { problemSubmissionsReducer } from "@/domains/problem/problem-submissions/state/problem-submissions-slice";
import { healthReducer } from "@/domains/health/state/health-slice";

export const makeStore = () =>
  configureStore({
    reducer: {
      health: healthReducer,
      problems: problemReducer,
      problemSetup: problemSetupReducer,
      problemSubmissions: problemSubmissionsReducer,
      user: userReducer,
      workspace: workspaceReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefault) =>
      // Listener middleware is prepended (not concat'd) so it runs before the
      // dev-only serializability/immutability check middleware, per the RTK
      // docs: https://redux-toolkit.js.org/api/createListenerMiddleware
      getDefault()
        .prepend(listenerMiddleware.middleware)
        .concat(baseApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
