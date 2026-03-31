"use client";

import React from "react";
import { routerConfig } from "@/router-config";
import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";

export default function AuthSignupButton( {children, ...props}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean
    }) {
  return <Button asChild {...props}>
    <a href={routerConfig.authSignUp.path}>{children}</a>
  </Button>;
}
