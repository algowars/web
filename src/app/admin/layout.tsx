"use client";

import React from "react";
import { PermissionGuard } from "@/features/auth/guards/permission.guard";
import { PUBLIC_ROLES } from "@/features/auth/public-roles";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PermissionGuard requiredPermissions={[PUBLIC_ROLES.ADMIN]}>
      <>{children}</>
    </PermissionGuard>
  );
}
