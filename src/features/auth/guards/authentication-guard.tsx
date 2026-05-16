"use client";

import { useUser } from "@auth0/nextjs-auth0";

type AuthenticationGuardProps = {
  fallbackComponent?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  children: React.ReactNode;
};

export default function AuthenticationGuard({
  fallbackComponent,
  loadingComponent,
  children,
}: AuthenticationGuardProps) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return loadingComponent ?? null;
  }

  if (user) {
    return children;
  }

  return fallbackComponent ?? null;
}
