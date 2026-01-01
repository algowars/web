"use client";

import { useEffect } from "react";
import { AuthStatus, useAccount } from "../account.context";
import PageLoader from "@/components/loader/page-loader/page-loader";
import { redirect } from "next/navigation";
import { routerConfig } from "@/router-config";
import { toast } from "sonner";

export default function AuthCallback() {
  const { authStatus, isPending, error } = useAccount();
  useEffect(() => {
    if (!isPending) {
      if (authStatus === AuthStatus.PARTIALLY_AUTHENTICATED) {
        redirect(routerConfig.accountSetup.path);
      }

      if (authStatus === AuthStatus.FULLY_AUTHENTICATED) {
        redirect(routerConfig.dashboard.path);
      }

      if (error) {
        toast.success("Error getting account information", {
          description: error.message,
        });
      }
      redirect(routerConfig.home.path);
    }
  }, [authStatus, isPending, error?.message, error]);

  return <PageLoader message="Getting account information" />;
}
