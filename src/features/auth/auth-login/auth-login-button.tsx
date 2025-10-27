"use client";

import React from "react";
import { buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { routerConfig } from "@/router-config";

export default function AuthLoginButton(
  props: React.ComponentProps<"a"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
) {
  return <a {...props} href={routerConfig.authLogIn.path} />;
}
