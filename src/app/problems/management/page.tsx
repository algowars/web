import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import AdminProblemsTable from "@/features/problems/admin-problems-table/admin-problems-table";
import ProblemManagementHeader from "@/features/problems/problem-management/problem-management-header/problem-management-header";
import { routerConfig } from "@/router-config";

export default function ProblemsManagementPage() {
  return (
    <SidebarLayout
      breadcrumbs={[
        { name: "Home", url: routerConfig.home.path },
        { name: "Problem Management", url: routerConfig.problemMangement.path },
      ]}
    >
      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex gap-1">
            <ProblemManagementHeader />
          </CardHeader>
          <CardContent>
            <AdminProblemsTable />
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
