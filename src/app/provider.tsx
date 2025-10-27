"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";

import { MainErrorFallback } from "@/components/errors/main-error-fallback";
import { queryConfig } from "@/lib/react-query";
import { AccountProvider } from "@/features/auth/account.context";

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      })
  );

  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <AccountProvider>
          <Toaster position="top-right" />
          {children}
        </AccountProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
