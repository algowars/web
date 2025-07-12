"use client";

import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";

export default function AuthSignupButton(
  props: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
) {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/account/setup",
      },
      authorizationParams: {
        prompt: "login",
        screen_hint: "signup",
      },
    });
  };

  return <Button {...props} onClick={handleSignUp} />;
}

export const useAuthSignup = () => {
  const { loginWithRedirect } = useAuth0();

  return {
    signup: () =>
      loginWithRedirect({
        appState: {
          returnTo: "/account/setup",
        },
        authorizationParams: {
          prompt: "login",
          screen_hint: "signup",
        },
      }),
  };
};
