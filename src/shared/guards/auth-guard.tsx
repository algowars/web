"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { useAppSelector } from "@/shared/state/hooks";
import {
  selectIsAuthenticated,
  selectIsFullyLoaded,
  selectUserPermissions,
} from "@/domains/user/state/user-slice";
import type { Permission } from "@/shared/lib/permissions";
import { AuthGuardFallback } from "./auth-guard-fallback";

type AuthGuardProps = {
  children: ReactNode;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
  permission?: Permission | Permission[];
  requireAll?: boolean;
};

const emptySubscribe = () => () => {};

/**
 * Returns `false` during SSR and on the client's first hydration pass,
 * then `true` for every render after that. This mirrors what a mount-flag
 * `useEffect(() => setHasMounted(true), [])` was doing, but goes through
 * useSyncExternalStore instead — the primitive React intends for values
 * that legitimately differ between the server snapshot and the client
 * snapshot, so it doesn't trigger the "setState in an effect" cascading
 * render warning.
 */
function useHasMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client snapshot
    () => false // server snapshot
  );
}

export function AuthGuard({
  children,
  fallback,
  loadingFallback = null,
  permission,
  requireAll = true,
}: Readonly<AuthGuardProps>) {
  const hasMounted = useHasMounted();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isFullyLoaded = useAppSelector(selectIsFullyLoaded);
  const userPermissions = useAppSelector(selectUserPermissions);

  // SSR and the client's first hydration pass both render this branch,
  // regardless of what's already in the (possibly already-populated) store.
  console.log(hasMounted, isAuthenticated, isFullyLoaded, userPermissions);
  if (!hasMounted || !isFullyLoaded) {
    return <>{loadingFallback}</>;
  }

  if (!isAuthenticated) {
    return <>{fallback ?? <AuthGuardFallback reason="unauthenticated" />}</>;
  }

  if (permission) {
    const required = Array.isArray(permission) ? permission : [permission];
    const hasPermission = requireAll
      ? required.every((p) => userPermissions.includes(p))
      : required.some((p) => userPermissions.includes(p));

    if (!hasPermission) {
      return <>{fallback ?? <AuthGuardFallback reason="forbidden" />}</>;
    }
  }

  return <>{children}</>;
}
