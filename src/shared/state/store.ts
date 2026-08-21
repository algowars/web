import { userReducer } from "@/domains/user/state/user-slice";
import { problemSetupReducer } from "@/domains/problem/state/problem-setup-slice";
import { workspaceReducer } from "@/domains/workspace/state/workspace-slice";
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../lib/base-api";
import { listenerMiddleware } from "./listener-middleware";

// Note: the game domain no longer has a redux slice — it's fully on
// react-query + zustand now (see src/domains/game/state/game-session-store.ts
// and src/domains/game/hooks/use-game-session.ts).
export const makeStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      problemSetup: problemSetupReducer,
      workspace: workspaceReducer,
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
