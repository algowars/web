import React from "react";
import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { routerConfig } from "@/router-config";
import ProblemsDataTable from "@/features/problems/problems-table/problems-data-table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AdminProblemsTable from "@/features/problems/admin-problems-table/admin-problems-table";

export default function AdminDashboard() {
  return (
    <SidebarLayout
      breadcrumbs={[
        { name: "Home", url: routerConfig.home.path },
        { name: "Admin", url: routerConfig.admin.path },
      ]}
    >
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <Separator className="mb-6" />
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View, edit, or remove users.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Add user management table/component here */}
            <div className="text-muted-foreground">Coming soon</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Problem Management</CardTitle>
            <CardDescription>Manage coding problems.</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminProblemsTable />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
            <CardDescription>Configure platform-wide settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">Coming soon</div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
