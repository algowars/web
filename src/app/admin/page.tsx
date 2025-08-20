"use client";

import React from "react";
import { PermissionGuard } from "@/features/auth/guards/permission.guard";
import { PUBLIC_ROLES } from "@/features/auth/public-roles";

export default function AdminPage() {
  return (
    <PermissionGuard requiredPermissions={[PUBLIC_ROLES.ADMIN]}>
      <div>
        <h1>Admin Panel</h1>
        <p>Welcome, admin! You have access to this page.</p>
      </div>
    </PermissionGuard>
  );
}
