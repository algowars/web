import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { routerConfig } from "@/router-config";
import React from "react";

export default function Dashboard() {
  return (
    <SidebarLayout
      breadcrumbs={[{ name: "Home", url: routerConfig.home.path }]}
    >
      <h1>TESTING</h1>
    </SidebarLayout>
  );
}
