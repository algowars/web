"use client";

import PageLoader from "@/components/loader/page-loader/page-loader";
import { AuthStatus, useAccount } from "@/features/auth/account.context";
import Dashboard from "@/features/dashboard/dashboard";
import Landing from "@/features/landing/landing";
import React from "react";

export default function HomeContext() {
  const { authStatus, isLoading } = useAccount();

  if (isLoading) {
    return <PageLoader message="Loading..." />;
  }

  if (authStatus === AuthStatus.FULLY_AUTHENTICATED) {
    return <Dashboard />;
  }

  return <Landing />;
}
