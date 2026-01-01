"use client";

import { useEffect } from "react";
import { AuthStatus, useAccount } from "../account.context";
import { redirect } from "next/navigation";
import { routerConfig } from "@/router-config";

export function AccountAlreadyExistsGuard({
  children,
  redirectRoute = routerConfig.dashboard.path,
}: {
  children: React.ReactNode;
  redirectRoute?: string;
}) {
  const { authStatus } = useAccount();

  useEffect(() => {
    if (authStatus === AuthStatus.FULLY_AUTHENTICATED) {
      redirect(redirectRoute);
    }
  }, [authStatus, redirectRoute]);

  return children;
}
