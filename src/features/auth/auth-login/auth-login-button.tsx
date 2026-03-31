"use client";

import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { routerConfig } from "@/router-config";

export default function AuthLoginButton(
  {children, ...props}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean
    }
) {
  return <Button asChild {...props}>
    <a href={routerConfig.authLogIn.path}>{children}</a>
  </Button>;
}
