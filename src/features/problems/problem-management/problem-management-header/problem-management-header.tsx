"use client";

import { buttonVariants } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { useAccount } from "@/features/auth/account.context";
import { Permissions } from "@/features/auth/permissions/Permissions";
import { useHasPermissions } from "@/hooks/use-has-permissions";
import { cn } from "@/lib/utils";
import { routerConfig } from "@/router-config";
import Link from "next/link";

import React from "react";

export default function ProblemManagementHeader() {
  const { account } = useAccount();

  const isAbleToCreate = useHasPermissions(account?.permissions, [
    Permissions.CreateProblem,
  ]);

  return (
    <>
      <div>
        <CardTitle>Problem Management</CardTitle>
        <CardDescription>Manage coding problems.</CardDescription>
      </div>
      {isAbleToCreate ? (
        <Link
          href={routerConfig.createProblem.path}
          className={cn(buttonVariants({ variant: "default" }), "w-24 ml-auto")}
        >
          Create
        </Link>
      ) : null}
    </>
  );
}
