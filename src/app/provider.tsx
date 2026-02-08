"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MainErrorFallback } from "@/components/errors/main-error-fallback";
import { queryConfig } from "@/lib/react-query";
import { AccountProvider } from "@/features/auth/account.context";
import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { Auth0Provider } from "@auth0/nextjs-auth0";

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <Auth0Provider>
        <QueryClientProvider client={queryClient}>
          <AccountProvider>
            <Toaster position="top-right" />
            {children}
            {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
          </AccountProvider>
        </QueryClientProvider>
      </Auth0Provider>
    </ErrorBoundary>
  );
};
