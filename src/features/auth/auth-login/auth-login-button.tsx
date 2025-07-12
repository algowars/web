"use client";

import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";

export default function AuthLoginButton(
  props: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
) {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  return <Button {...props} onClick={handleLogin} />;
}

export const useAuthLogin = () => {
  const { loginWithRedirect } = useAuth0();

  return {
    login: () => loginWithRedirect(),
  };
};
