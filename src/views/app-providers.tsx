"use client";

import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";
import { MainErrorFallback } from "@/shared/errors/main-error-fallback";
import { AuthBridge } from "@/domains/auth/auth-bridge";
import StoreProvider from "@/shared/state/provider";
import HealthCheck from "@/domains/health/components/health-check";
import { SessionData } from "@auth0/nextjs-auth0/types";
import ReactQueryProvider from "@/shared/lib/react-query";

type AppProviders = {
  children: React.ReactNode;
  session: SessionData | null;
};

export default function AppProviders({
  children,
  session,
}: Readonly<AppProviders>) {
  return (
    <StoreProvider>
      <ReactQueryProvider>
        <ErrorBoundary FallbackComponent={MainErrorFallback}>
          <AuthBridge session={session} />
          <HealthCheck />
          <Toaster position="top-right" />
          {children}
        </ErrorBoundary>
      </ReactQueryProvider>
    </StoreProvider>
  );
}
