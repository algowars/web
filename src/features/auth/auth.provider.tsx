"use client";

import React from "react";
import { Auth0Provider, AppState } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { env } from "@/env";

type AuthProviderProps = {
  children?: React.ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
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
      {children}
    </Auth0Provider>
  );
}
