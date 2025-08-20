"use client";

import React from "react";
import { PermissionGuard } from "@/features/auth/guards/permission.guard";
import { PUBLIC_ROLES } from "@/features/auth/public-roles";
import AdminDashboard from "@/features/admin/admin-dashboard/admin-dashboard";

export default function AdminPage() {
  return (
    <PermissionGuard requiredPermissions={[PUBLIC_ROLES.ADMIN]}>
      <AdminDashboard />
    </PermissionGuard>
  );
}
