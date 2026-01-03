"use client";

import React from "react";
import { useAccount, AuthStatus } from "@/features/auth/account.context";

export interface AuthComponentGuardProps {
  children: React.ReactNode;
  partiallyAuthenticated?: React.ReactNode;
  unauthenticated?: React.ReactNode;
  loading?: React.ReactNode;
}

export function AuthComponentGuard({
  children,
  partiallyAuthenticated = null,
  unauthenticated = null,
}: AuthComponentGuardProps) {
  const { authStatus, isPending } = useAccount();

  if (isPending) {
    return <>Loading</>;
  }
  if (authStatus === AuthStatus.FULLY_AUTHENTICATED) return <>{children}</>;
  if (authStatus === AuthStatus.PARTIALLY_AUTHENTICATED)
    return <>{partiallyAuthenticated}</>;
  if (authStatus === AuthStatus.UNAUTHENTICATED) return <>{unauthenticated}</>;

  return null;
}
