"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";

import { MainErrorFallback } from "@/components/errors/main-error-fallback";
import { queryConfig } from "@/lib/react-query";
import AuthProvider from "@/features/auth/auth.provider";
import { Account } from "@/features/auth/models/account.model";
import { User } from "@auth0/auth0-react";

type AppProviderProps = {
  children: React.ReactNode;
  initialAccount?: Account | null;
  initialAuth0State?: {
    user?: User;
    isAuthenticated?: boolean;
    isLoading?: boolean;
    error?: Error;
  };
};

// Load React Query Devtools only on the client to avoid SSR localStorage access
const ReactQueryDevtools = dynamic(
  () =>
    import("@tanstack/react-query-devtools").then(
      (mod) => mod.ReactQueryDevtools
    ),
  { ssr: false }
);

export const AppProvider = ({
  children,
  initialAccount,
  initialAuth0State,
}: AppProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      })
  );

  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider
          initialAccount={initialAccount}
          initialAuth0State={initialAuth0State}
        >
          {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
          <Toaster position="top-right" />
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
