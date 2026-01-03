import { Permissions } from "@/features/auth/permissions/Permissions";
import PermissionsGuard from "@/features/auth/permissions/permissions.guard";
import React from "react";

export default function ProblemsManagementCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PermissionsGuard permissions={[Permissions.CreateProblem]}>
      {children}
    </PermissionsGuard>
  );
}
