import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { routerConfig } from "@/router-config";
import React from "react";
import ProblemsTableV2 from "../problems/problems-table-v2/problems-table-v2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <SidebarLayout
      breadcrumbs={[{ name: "Home", url: routerConfig.home.path }]}
    >
      <Card>
        <CardHeader>
          <CardTitle>Problems</CardTitle>
        </CardHeader>
        <CardContent>
          <ProblemsTableV2 />
        </CardContent>
      </Card>
    </SidebarLayout>
  );
}
