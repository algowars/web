"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageLoader from "@/components/loader/page-loader/page-loader";
import { useAccount, AuthStatus } from "@/features/auth/account.context";
import { routerConfig } from "@/router-config";

interface ApiError {
  status?: number;
  message?: string;
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authStatus, isLoading, auth0, error } = useAccount();

  useEffect(() => {
    if (isLoading || auth0.isLoading) {
      return;
    }

    const handleRedirect = () => {
      const returnTo = searchParams.get("returnTo");

      const apiError = error as ApiError | null;
      const is404Error =
        error?.message?.includes("404") ||
        error?.message?.includes("not found") ||
        apiError?.status === 404 ||
        apiError?.response?.status === 404;

      switch (authStatus) {
        case AuthStatus.FULLY_AUTHENTICATED:
          router.push(returnTo || routerConfig.home.path);
          break;

        case AuthStatus.PARTIALLY_AUTHENTICATED:
          if (is404Error) {
            router.push("/account/setup");
          } else {
            router.push(routerConfig.home.path);
          }
          break;

        case AuthStatus.UNAUTHENTICATED:
        default:
          router.push(routerConfig.home.path);
          break;
      }
    };

    const timer = setTimeout(handleRedirect, 1000);
    return () => clearTimeout(timer);
  }, [authStatus, isLoading, auth0.isLoading, router, searchParams, error]);

  const getLoadingMessage = (): string => {
    const apiError = error as ApiError | null;
    const is404Error =
      error?.message?.includes("404") ||
      error?.message?.includes("not found") ||
      apiError?.status === 404 ||
      apiError?.response?.status === 404;

    switch (authStatus) {
      case AuthStatus.FULLY_AUTHENTICATED:
        return "Authentication successful! Redirecting...";
      case AuthStatus.PARTIALLY_AUTHENTICATED:
        if (is404Error) {
          return "Setting up your account...";
        } else {
          return "Authentication completed! Redirecting...";
        }
      case AuthStatus.UNAUTHENTICATED:
        return "Authentication failed. Redirecting...";
      default:
        return "Completing authentication...";
    }
  };

  return <PageLoader message={getLoadingMessage()} className="bg-background" />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={<PageLoader message="Loading..." className="bg-background" />}
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
