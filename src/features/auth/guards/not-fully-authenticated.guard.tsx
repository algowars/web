"use client";

import { useEffect } from "react";
import { useAccount } from "../account.context";
import { redirect } from "next/navigation";
import { routerConfig } from "@/router-config";

export const AccountGuard: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const account = useAccount();

  useEffect(() => {
    if (account) {
      redirect(routerConfig.dashboard.path);
    }
  }, [account]);

  return !account ? children : null;
};
