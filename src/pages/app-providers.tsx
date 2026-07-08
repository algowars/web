"use client";

import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";
import { MainErrorFallback } from "@/shared/errors/main-error-fallback";
import { AuthBridge } from "@/domains/auth/auth-bridge";
import StoreProvider from "@/shared/state/provider";

type AppProviders = {
  children: React.ReactNode;
};

export default function AppProviders({ children }: AppProviders) {
  return (
    <StoreProvider>
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <AuthBridge />
        <Toaster position="top-right" />
        {children}
      </ErrorBoundary>
    </StoreProvider>
  );
}
