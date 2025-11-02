"use client";

import React from "react";
import { useAccount } from "../account.context";
import {
  HasPermissionMode,
  useHasPermissions,
} from "@/hooks/use-has-permissions";
import { Permissions } from "./Permissions";
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
  const { account } = useAccount();

  const isOk = useHasPermissions(account?.permissions, permissions, mode);

  if (!isOk) {
    redirect(routerConfig.home.path);
  }

  return children;
}
