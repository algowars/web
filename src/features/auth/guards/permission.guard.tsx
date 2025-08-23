"use client";

import React from "react";
import {
  withAuthenticationRequired,
  WithAuthenticationRequiredOptions,
} from "@auth0/auth0-react";
import { useAccount, AuthStatus } from "@/features/auth/account.context";
import { useUserRoles } from "@/features/auth/roles/user-roles";
import { useRouter } from "next/navigation";
import { routerConfig } from "@/router-config";
import { useAuthLogin } from "../auth-login/auth-login-button";

export interface PermissionGuardProps {
  authOptions?: WithAuthenticationRequiredOptions;
  requiredPermissions: string[];
  fallback?: React.ReactNode;
  children: React.ReactElement;
  loadingFallback?: React.ReactNode;
}

export function PermissionGuard({
  authOptions,
  requiredPermissions,
  fallback = <div>Access Denied</div>,
  loadingFallback = <div>Loading...</div>,
  children,
}: PermissionGuardProps) {
  const { authStatus } = useAccount();
  const { roles: userPermissions, isLoading } = useUserRoles();
  const router = useRouter();
  const login = useAuthLogin();

  const hasPermission = requiredPermissions
    .map((perm) => perm.toLowerCase())
    .some((perm) =>
      userPermissions.map((role) => role.toLowerCase()).includes(perm)
    );

  React.useEffect(() => {
    if (authStatus === AuthStatus.PARTIALLY_AUTHENTICATED) {
      router.replace(routerConfig.accountSetup.path);
    }
    if (
      authStatus === AuthStatus.FULLY_AUTHENTICATED &&
      !hasPermission &&
      !isLoading
    ) {
      router.replace(routerConfig.home.path);
    }
  }, [authStatus, hasPermission, isLoading, router]);

  const Wrapped = React.useMemo(
    () => withAuthenticationRequired(() => children, authOptions),
    [children, authOptions]
  );

  if (isLoading) {
    return loadingFallback;
  }

  if (authStatus === AuthStatus.PARTIALLY_AUTHENTICATED) {
    return null;
  }

  if (authStatus === AuthStatus.UNAUTHENTICATED) {
    login.login();
    return null;
  }

  if (authStatus === AuthStatus.FULLY_AUTHENTICATED && !hasPermission) {
    return fallback;
  }

  return <Wrapped />;
}
