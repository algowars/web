"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

// Lazily load React Query Devtools after mount to avoid SSR importing
let DevtoolsComponent: React.ComponentType | null = null;

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

  // Ensure devtools never attempt to load during SSR
  const [isClient, setIsClient] = React.useState(false);
  const [Devtools, setDevtools] = React.useState<React.ComponentType | null>(
    null
  );
  React.useEffect(() => {
    setIsClient(true);
    if (process.env.NODE_ENV === "development") {
      // Dynamically import on the client after mount only
      import("@tanstack/react-query-devtools")
        .then((mod) => {
          DevtoolsComponent = mod.ReactQueryDevtools;
          setDevtools(() => DevtoolsComponent);
        })
        .catch(() => {
          // no-op if devtools fail to load
        });
    }
  }, []);

  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider
          initialAccount={initialAccount}
          initialAuth0State={initialAuth0State}
        >
          {process.env.NODE_ENV === "development" && isClient && Devtools && (
            <Devtools />
          )}
          <Toaster position="top-right" />
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
