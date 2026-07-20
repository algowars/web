import { userReducer } from "@/domains/user/state/user-slice";
import { problemReducer } from "@/domains/problem/state/problem-slice";
import { problemSetupReducer } from "@/domains/problem/state/problem-setup-slice";
import { workspaceReducer } from "@/domains/workspace/state/workspace-slice";
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../lib/base-api";
import { listenerMiddleware } from "./listener-middleware";
import { problemSubmissionsReducer } from "@/domains/problem/problem-submissions/state/problem-submissions-slice";

export const makeStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      problems: problemReducer,
      problemSetup: problemSetupReducer,
      workspace: workspaceReducer,
      problemSubmissions: problemSubmissionsReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefault) =>
      getDefault()
        .concat(listenerMiddleware.middleware)
        .concat(baseApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
