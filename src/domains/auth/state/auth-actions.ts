import { User } from "@auth0/nextjs-auth0/types";
import { createAction } from "@reduxjs/toolkit";

export const AuthActions = {
  authCheckStarted: createAction("auth/checkStarted"),
  userAuthenticated: createAction<{ user: User }>("auth/userAuthenticated"),
  userUnauthenticated: createAction("auth/userUnauthenticated"),
  authCheckFailed: createAction<{ message: string; code?: string }>(
    "auth/checkFailed"
  ),
  sessionExpired: createAction("auth/sessionExpired"),
};
