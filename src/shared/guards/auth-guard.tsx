"use client";

import type { ReactNode } from "react";
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

  /**
   * Rendered when the user is unauthenticated, or authenticated but missing
   * a required permission. Defaults to `AuthGuardFallback`, which shows a
   * sign-in prompt or a "not permitted" message depending on which case
   * applied. Pass your own node to override both cases with the same UI.
   */
  fallback?: ReactNode;

  /**
   * Rendered instead of `fallback`/`children` while auth/user state is
   * still resolving, so the guard doesn't flash the fallback before the
   * real auth state is known. Defaults to rendering nothing.
   */
  loadingFallback?: ReactNode;

  /**
   * One or more permissions the user must have (in addition to being
   * authenticated) to see `children`. Omit to only require authentication.
   */
  permission?: Permission | Permission[];

  /**
   * When `permission` is an array: require every permission (default) or
   * just one of them.
   */
  requireAll?: boolean;
};

export function AuthGuard({
  children,
  fallback,
  loadingFallback = null,
  permission,
  requireAll = true,
}: Readonly<AuthGuardProps>) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isFullyLoaded = useAppSelector(selectIsFullyLoaded);
  const userPermissions = useAppSelector(selectUserPermissions);

  if (!isFullyLoaded) {
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
