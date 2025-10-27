"use client";

import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { routerConfig } from "@/router-config";

export default function AuthSignupButton(props: React.ComponentProps<"a">) {
  return <a {...props} href={routerConfig.authSignUp.path} />;
}
