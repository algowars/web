"use client";

import { buttonVariants } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { accountStore } from "@/features/account/account-store";
import { useHasPermissions } from "@/hooks/use-has-permissions";
import { Permissions } from "@/features/auth/permissions/models/permissions";
import { cn } from "@/lib/utils";
import { routerConfig } from "@/router-config";
import Link from "next/link";

export default function ProblemManagementHeader() {
  const account = accountStore((state) => state.account);

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
