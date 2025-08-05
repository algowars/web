import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import ProblemsDataTable from "@/features/problems/problems-table/problems-data-table";
import { routerConfig } from "@/router-config";
import React from "react";

export default function ProblemsPage() {
  return (
    <SidebarLayout
      breadcrumbs={[
        {
          name: "Home",
          url: routerConfig.home.path,
        },
        {
          name: "Problems",
          url: routerConfig.problems.path,
        },
      ]}
    >
      <ProblemsDataTable />
    </SidebarLayout>
  );
}
