import LandingLayout from "@/components/layouts/landing-layout/landing-layout";
import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
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
      <h1>TESTING</h1>
    </SidebarLayout>
  );
}
