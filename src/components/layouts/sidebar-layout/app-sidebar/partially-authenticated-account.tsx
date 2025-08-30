"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { routerConfig } from "@/router-config";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export function PartiallyAuthenticatedAccount({
  message = "Please finish setting up your account to continue.",
  ctaText = "Complete account setup",
}: {
  message?: string;
  ctaText?: string;
}) {
  const router = useRouter();
  return (
    <Card className="py-2">
      <CardHeader className="px-2">
        <CardTitle>Finish account setup</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        <div className="flex flex-col gap-2">
          <Link
            href={routerConfig.accountSetup.path}
            className={buttonVariants({ variant: "default" })}
          >
            {ctaText}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
