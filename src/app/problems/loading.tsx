import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routerConfig } from "@/router-config";

export default function ProblemsLoading() {
  return (
    <SidebarLayout
      breadcrumbs={[
        { url: routerConfig.home.path, name: "Home" },
        { url: routerConfig.problems.path, name: "Problems" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle>Problems</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {/* Table header */}
          <div className="flex gap-4 pb-1 border-b">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          {/* Table rows */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-1">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    </SidebarLayout>
  );
}
