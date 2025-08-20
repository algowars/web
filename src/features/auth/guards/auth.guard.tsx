"use client";

import React from "react";
import {
  withAuthenticationRequired,
  WithAuthenticationRequiredOptions,
} from "@auth0/auth0-react";
import { useAccount, AuthStatus } from "@/features/auth/account.context";
import { redirect, useRouter } from "next/navigation";
import { routerConfig } from "@/router-config";
import { useAuthLogin } from "../auth-login/auth-login-button";

export interface AuthGuardProps {
  authOptions?: WithAuthenticationRequiredOptions;
  requireFullAccount?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactElement;
}

export function AuthGuard({
  authOptions,
  requireFullAccount = true,
  children,
}: AuthGuardProps) {
  const { authStatus } = useAccount();
  const router = useRouter();
  const login = useAuthLogin();

  React.useEffect(() => {
    if (
      requireFullAccount &&
      authStatus === AuthStatus.PARTIALLY_AUTHENTICATED
    ) {
      router.replace(routerConfig.accountSetup.path);
    }
  }, [requireFullAccount, authStatus, router]);

  const Wrapped = React.useMemo(
    () => withAuthenticationRequired(() => children, authOptions),
    [children, authOptions]
  );

  if (requireFullAccount && authStatus === AuthStatus.PARTIALLY_AUTHENTICATED) {
    redirect(routerConfig.accountSetup.path);
  }

  if (requireFullAccount && authStatus === AuthStatus.UNAUTHENTICATED) {
    login.login();
  }

  return <Wrapped />;
}
