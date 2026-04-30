"use client";

import { useEffect } from "react";
import { accountStore } from "@/features/account/account-store";
import { redirect } from "next/navigation";
import { routerConfig } from "@/router-config";

export const AccountGuard: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const account = accountStore((state) => state.account);

  useEffect(() => {
    if (account) {
      redirect(routerConfig.dashboard.path);
    }
  }, [account]);

  return !account ? children : null;
};
