import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { CreateProblemProvider } from "@/features/create-problem/create-problem-context";
import CreateProblemDetails from "@/features/create-problem/create-problem-details/create-problem-details";
import { routerConfig } from "@/router-config";
import React from "react";

export default function AdminProblemCreatePage() {
  return (
    <SidebarLayout
      breadcrumbs={[
        {
          url: routerConfig.home.path,
          name: "Home",
        },
        {
          url: routerConfig.admin.path,
          name: "Admin",
        },
        {
          url: routerConfig.createProblem.path,
          name: "Create",
        },
      ]}
      defaultOpen={true}
    >
      <CreateProblemProvider>
        <div className="h-full">
          <CreateProblemDetails />
        </div>
      </CreateProblemProvider>
    </SidebarLayout>
  );
}
