"use client";

import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";
import { MainErrorFallback } from "@/shared/errors/main-error-fallback";
import { AuthBridge } from "@/domains/auth/auth-bridge";
import StoreProvider from "@/shared/state/provider";
import HealthCheck from "@/domains/health/components/health-check";

type AppProviders = {
  children: React.ReactNode;
};

export default function AppProviders({ children }: Readonly<AppProviders>) {
  return (
    <StoreProvider>
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <AuthBridge />
        <HealthCheck />
        <Toaster position="top-right" />
        {children}
      </ErrorBoundary>
    </StoreProvider>
  );
}
