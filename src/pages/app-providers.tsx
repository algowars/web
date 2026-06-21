"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MainErrorFallback } from "@/shared/errors/main-error-fallback";
import { queryConfig } from "@/shared/lib/react-query";
import UserInitializer from "@/domains/user/user-initializer";

type AppProviders = {
  children: React.ReactNode;
};

export default function AppProviders({ children }: AppProviders) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      })
  );

  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <UserInitializer />
        <Toaster position="top-right" />
        {children}
        {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
