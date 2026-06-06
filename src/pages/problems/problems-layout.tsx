import ProblemInitializer from "@/domains/problem/state/problem-initializer";
import ProblemTable from "@/domains/problem/tables/problem-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import SidebarLayout from "@/shared/layouts/sidebar-layout/sidebar-layout";

export default function ProblemsLayout() {
  return (
    <SidebarLayout breadcrumbs={[]}>
      <ProblemInitializer />
      <Card>
        <CardHeader>
          <CardTitle>Problems</CardTitle>
        </CardHeader>
        <CardContent>
          <ProblemTable />
        </CardContent>
      </Card>
    </SidebarLayout>
  );
}
