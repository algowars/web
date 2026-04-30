"use client";

import { useEffect } from "react";
import { accountStore } from "@/features/account/account-store";
import PageLoader from "@/components/loader/page-loader/page-loader";
import { redirect } from "next/navigation";
import { routerConfig } from "@/router-config";

export default function AuthCallback() {
  const account = accountStore((state) => state.account);
  const isLoading = accountStore((state) => state.isLoading);

  useEffect(() => {
    if (isLoading) return;

    if (account !== null) {
      if (!account.usernameLastChangedAt) {
        redirect(routerConfig.accountSetup.path);
      } else {
        redirect(routerConfig.dashboard.path);
      }
    } else {
      redirect(routerConfig.home.path);
    }
  }, [account, isLoading]);

  return <PageLoader message="Getting account information" />;
}
