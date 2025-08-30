"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import AuthLoginButton, {
  useAuthLogin,
} from "@/features/auth/auth-login/auth-login-button"; // existing hook in repo
import Link from "next/link";
import AuthSignupButton from "@/features/auth/auth-signup/auth-signup-button";

export function UnauthenticatedAccount({
  message = "Join the community to interact with this content",
  ctaText = "Sign up / Log in",
}: {
  message?: string;
  ctaText?: string;
}) {
  const login = useAuthLogin();
  return (
    <Card className="py-2">
      <CardHeader className="px-2">
        <CardTitle>Join Algowars</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        <div className="flex flex-col gap-2">
          <AuthLoginButton className="w-full">Login</AuthLoginButton>
          <AuthSignupButton variant="secondary">Get Started</AuthSignupButton>
        </div>
      </CardContent>
    </Card>
  );
}
