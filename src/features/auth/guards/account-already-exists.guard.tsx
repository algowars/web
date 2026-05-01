"use client";

import { useEffect } from "react";
import { accountStore } from "@/features/account/account-store";
import { redirect } from "next/navigation";
import { routerConfig } from "@/router-config";

export function AccountAlreadyExistsGuard({
  children,
  redirectRoute = routerConfig.dashboard.path,
}: {
  children: React.ReactNode;
  redirectRoute?: string;
}) {
  const account = accountStore((state) => state.account);

  useEffect(() => {
    if (account?.username) {
      redirect(redirectRoute);
    }
  }, [account, redirectRoute]);

  return children;
}
