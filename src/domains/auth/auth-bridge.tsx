"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { useAppDispatch } from "@/shared/state/hooks";
import { AuthActions } from "./state/auth-events";
import { routerConfig } from "@/shared/router-config";
import { SessionData } from "@auth0/nextjs-auth0/types";

type Auth0BridgeProps = {
  session: SessionData | null;
};

export function AuthBridge({ session }: Readonly<Auth0BridgeProps>) {
  const dispatch = useAppDispatch();
  const user = session?.user;

  useEffect(() => {
    dispatch(AuthActions.authCheckStarted());
  }, []);

  useEffect(() => {
    if (user) {
      // Drives the user-sync listener in listener-middleware.ts (upserts the
      // backend user record and loads the account) — without this dispatch
      // that flow never runs.
      dispatch(AuthActions.userAuthenticated({ user }));
    } else {
      dispatch(AuthActions.userUnauthenticated());
    }
  }, [dispatch, user]);

  return null;
}
