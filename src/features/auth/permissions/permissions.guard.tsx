"use client";

import React from "react";
import { accountStore } from "@/features/account/account-store";
import {
  HasPermissionMode,
  useHasPermissions,
} from "@/shared/hooks/use-has-permissions";
import { Permissions } from "./models/permissions";
import { redirect } from "next/navigation";
import { routerConfig } from "@/router-config";

type PermissionGuardProps = {
  children?: React.ReactNode;
  permissions?: Permissions[];
  mode?: HasPermissionMode;
};

export default function PermissionsGuard({
  children,
  permissions = [],
  mode,
}: PermissionGuardProps) {
  const account = accountStore((state) => state.account);
  const isLoading = accountStore((state) => state.isLoading);

  const isOk = useHasPermissions(account?.permissions, permissions, mode);
  if (!isLoading && !isOk) {
    redirect(routerConfig.home.path);
  }

  return children;
}
