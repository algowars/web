import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { routerConfig } from "@/router-config";
import React from "react";
import ProblemsDataTable from "../problems/problems-table/problems-data-table";

export default function Dashboard() {
  return (
    <SidebarLayout
      breadcrumbs={[{ name: "Home", url: routerConfig.home.path }]}
    >
      <ProblemsDataTable />
    </SidebarLayout>
  );
}
