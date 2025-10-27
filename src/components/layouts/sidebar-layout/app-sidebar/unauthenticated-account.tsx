"use client";

import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import AuthSignupButton from "@/features/auth/auth-signup/auth-signup-button";
import AuthLoginButton from "@/features/auth/auth-login/auth-login-button";
import { cn } from "@/lib/utils";

export function UnauthenticatedAccount({
  message = "Join the community to interact with this content",
  ctaText = "Sign up / Log in",
}: {
  message?: string;
  ctaText?: string;
}) {
  return (
    <Card className="overflow-visible -mx-2">
      <CardHeader className="px-2.5">
        <CardTitle>Join Algowars</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="px-2.5">
        <div className="-mx-6 px-6 flex flex-col gap-2">
          <AuthLoginButton
            className={cn(buttonVariants({ variant: "default" }), "w-full")}
          >
            Login
          </AuthLoginButton>
          <AuthSignupButton
            className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
          >
            Get Started
          </AuthSignupButton>
        </div>
      </CardContent>
    </Card>
  );
}
