"use client";

import { useEffect } from "react";
import type { SessionData } from "@auth0/nextjs-auth0/types";
import { useUserStore } from "@/domains/user/state/user-store";
import { useUserSync } from "@/domains/user/hooks/use-user-sync";

type Auth0BridgeProps = {
  session: SessionData | null;
};

export function AuthBridge({ session }: Readonly<Auth0BridgeProps>) {
  const authCheckStarted = useUserStore((s) => s.authCheckStarted);
  const userAuthenticated = useUserStore((s) => s.userAuthenticated);
  const userUnauthenticated = useUserStore((s) => s.userUnauthenticated);
  const { syncUser } = useUserSync();
  const user = session?.user;

  useEffect(() => {
    authCheckStarted();
    // Only run once on mount, matching the previous `authCheckStarted` dispatch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      userAuthenticated(user);
      void syncUser(user.sub);
    } else {
      userUnauthenticated();
    }
    // syncUser is stable-enough (memoized on its own deps); only re-run when the
    // Auth0 user identity actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return null;
}
