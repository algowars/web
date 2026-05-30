import SidebarLayout from "@/shared/components/layouts/sidebar-layout/sidebar-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import ProblemsTableV2 from "@/features/problems/problems-table-v2/problems-table-v2";
import { routerConfig } from "@/router-config";

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
