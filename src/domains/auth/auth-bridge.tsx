"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { useAppDispatch } from "@/shared/state/hooks";
import { AuthEvents } from "./state/auth-events";
import { routerConfig } from "@/shared/router-config";

export function AuthBridge() {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useUser();

  const prevLoading = useRef<boolean>(false);
  const prevUserId = useRef<string | undefined>(undefined);
  const isRedirecting = useRef<boolean>(false);

  useEffect(() => {
    if (isLoading && !prevLoading.current) {
      dispatch(AuthEvents.authCheckStarted());
      prevLoading.current = true;
      return;
    }

    if (isLoading) return;

    prevLoading.current = false;

    if (error) {
      dispatch(
        AuthEvents.authCheckFailed({
          message: error.message,
        })
      );

      dispatch(AuthEvents.sessionExpired());

      if (!isRedirecting.current) {
        isRedirecting.current = true;
        const returnTo = window.location.pathname + window.location.search;
        window.location.assign(
          `${routerConfig.authLogIn.path}?returnTo=${encodeURIComponent(returnTo)}`
        );
      }

      return;
    }

    if (user) {
      if (user.sub !== prevUserId.current) {
        dispatch(AuthEvents.userAuthenticated({ user }));
        prevUserId.current = user.sub;
      }
      return;
    }

    if (prevUserId.current !== undefined) {
      dispatch(AuthEvents.userUnauthenticated());
    }
    prevUserId.current = undefined;
  }, [user, isLoading, error, dispatch]);

  return null;
}
