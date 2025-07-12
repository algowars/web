"use client";

import React from "react";
import { Auth0Provider, AppState, User } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { env } from "@/env";
import { AccountProvider } from "./account.context";
import { Account } from "./models/account.model";

type AuthProviderProps = {
  children?: React.ReactNode;
  initialAccount?: Account | null;
  initialAuth0State?: {
    user?: User;
    isAuthenticated?: boolean;
    isLoading?: boolean;
    error?: Error;
  };
};

export default function AuthProvider({
  children,
  initialAccount,
  initialAuth0State,
}: AuthProviderProps) {
  const router = useRouter();

  const onRedirectCallback = (appState?: AppState) => {
    router.push(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: env.NEXT_PUBLIC_AUTH0_CALLBACK_URL,
        audience: env.NEXT_PUBLIC_AUTH0_AUDIENCE,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      <AccountProvider
        initialAccount={initialAccount}
        initialAuth0State={initialAuth0State}
      >
        {children}
      </AccountProvider>
    </Auth0Provider>
  );
}
