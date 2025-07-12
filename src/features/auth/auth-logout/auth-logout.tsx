"use client";

import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";

export default function AuthLogout(
  props: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
) {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return <Button {...props} onClick={handleLogout} />;
}

export const useAuthLogout = () => {
  const { logout } = useAuth0();

  return {
    logout: () =>
      logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      }),
  };
};
