"use client";

import React from "react";
import {
  withAuthenticationRequired,
  WithAuthenticationRequiredOptions,
} from "@auth0/auth0-react";

export interface PartiallyAuthenticatedAuthGuardProps {
  authOptions?: WithAuthenticationRequiredOptions;
  children: React.ReactElement;
}

export function PartiallyAuthenticatedAuthGuard({
  authOptions,
  children,
}: PartiallyAuthenticatedAuthGuardProps) {
  const Wrapped = React.useMemo(
    () => withAuthenticationRequired(() => children, authOptions),
    [children, authOptions]
  );
  return <Wrapped />;
}
