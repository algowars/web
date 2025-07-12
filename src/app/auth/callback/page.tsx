"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageLoader from "@/components/loader/page-loader/page-loader";
import { useAccount, AuthStatus } from "@/features/auth/account.context";
import { routerConfig } from "@/router-config";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authStatus, isLoading, auth0 } = useAccount();

  useEffect(() => {
    if (isLoading || auth0.isLoading) {
      return;
    }

    const handleRedirect = () => {
      const returnTo = searchParams.get("returnTo");

      switch (authStatus) {
        case AuthStatus.FULLY_AUTHENTICATED:
          router.push(returnTo || routerConfig.home.path);
          break;

        case AuthStatus.PARTIALLY_AUTHENTICATED:
          router.push("/account/setup");
          break;

        case AuthStatus.UNAUTHENTICATED:
        default:
          router.push(routerConfig.home.path);
          break;
      }
    };

    const timer = setTimeout(handleRedirect, 1000);
    return () => clearTimeout(timer);
  }, [authStatus, isLoading, auth0.isLoading, router, searchParams]);

  const getLoadingMessage = (): string => {
    switch (authStatus) {
      case AuthStatus.FULLY_AUTHENTICATED:
        return "Authentication successful! Redirecting...";
      case AuthStatus.PARTIALLY_AUTHENTICATED:
        return "Setting up your account...";
      case AuthStatus.UNAUTHENTICATED:
        return "Authentication failed. Redirecting...";
      default:
        return "Completing authentication...";
    }
  };

  return <PageLoader message={getLoadingMessage()} className="bg-background" />;
}
