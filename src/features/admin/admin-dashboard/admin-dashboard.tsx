import React from "react";
import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { routerConfig } from "@/router-config";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AdminProblemsTable from "@/features/problems/admin-problems-table/admin-problems-table";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

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
            <div className="text-muted-foreground">Coming soon</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex gap-1">
            <div>
              <CardTitle>Problem Management</CardTitle>
              <CardDescription>Manage coding problems.</CardDescription>
            </div>
            <Link
              href={routerConfig.createProblem.path}
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-24 ml-auto"
              )}
            >
              Create
            </Link>
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
