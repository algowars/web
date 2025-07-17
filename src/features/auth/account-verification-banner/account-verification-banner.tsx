"use client";

import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { AuthStatus, useAccount } from "../account.context";
import { routerConfig } from "@/router-config";

export default function AccountVerificationBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const { authStatus, error } = useAccount();

  const shouldShowBanner =
    authStatus === AuthStatus.PARTIALLY_AUTHENTICATED &&
    error?.message?.includes("404") &&
    isVisible;

  if (!shouldShowBanner) {
    return null;
  }

  return (
    <Alert className="relative bg-secondary rounded-none border-none border-b flex items-center py-2 px-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between w-full pr-8">
        <span className="flex-1">
          Please finish setting up your account to access all features.
        </span>
        <div className="flex items-center gap-2 ml-4">
          <Button asChild size="sm" variant="outline">
            <Link href={routerConfig.accountSetup.path}>Complete Setup</Link>
          </Button>
        </div>
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsVisible(false)}
        className="absolute top-1/2 -translate-y-1/2 right-2 h-6 w-6 flex"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close banner</span>
      </Button>
    </Alert>
  );
}
