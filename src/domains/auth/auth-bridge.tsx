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
  const hasResolvedOnce = useRef<boolean>(false);
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

      // Only treat this as an active session going bad — worth a hard
      // redirect — if we'd previously seen an authenticated user. A visitor
      // who was never logged in shouldn't get bounced automatically; they
      // should just see AuthGuard's normal "Sign in" fallback.
      const hadActiveSession = prevUserId.current !== undefined;

      dispatch(AuthEvents.sessionExpired());

      if (hadActiveSession && !isRedirecting.current) {
        isRedirecting.current = true;
        const returnTo = window.location.pathname + window.location.search;
        window.location.assign(
          `${routerConfig.authLogIn.path}?returnTo=${encodeURIComponent(returnTo)}`
        );
      }

      prevUserId.current = undefined;
      hasResolvedOnce.current = true;
      return;
    }

    if (user) {
      if (user.sub !== prevUserId.current) {
        dispatch(AuthEvents.userAuthenticated({ user }));
        prevUserId.current = user.sub;
      }
      hasResolvedOnce.current = true;
      return;
    }

    // Dispatch on every transition INTO "no user" — including the very
    // first resolution, when prevUserId.current is still undefined by
    // default. Without the `!hasResolvedOnce.current` check, a visitor who
    // was never logged in would never get this dispatched, isAuthLoading
    // would never clear, and AuthGuard would render its loading fallback
    // (null) forever instead of ever reaching the unauthenticated state.
    if (prevUserId.current !== undefined || !hasResolvedOnce.current) {
      dispatch(AuthEvents.userUnauthenticated());
    }
    prevUserId.current = undefined;
    hasResolvedOnce.current = true;
  }, [user, isLoading, error, dispatch]);

  return null;
}
