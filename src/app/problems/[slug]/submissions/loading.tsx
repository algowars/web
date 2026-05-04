import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { routerConfig } from "@/router-config";

export default function Loading() {
  return (
    <SidebarLayout
      breadcrumbs={[
        { url: routerConfig.home.path, name: "Home" },
        { url: routerConfig.problems.path, name: "Problems" },
        { url: "#", name: "..." },
        { url: "#", name: "Submissions" },
      ]}
      defaultOpen={true}
    >
      <div className="grid grid-cols-12 gap-3">
        <Card className="col-span-12">
          <CardHeader className="gap-4">
            <Skeleton className="h-6 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-4/6" />
          </CardContent>
        </Card>

        <Card className="col-span-9">
          <CardHeader>
            <Skeleton className="h-9 w-64 rounded-md" />
          </CardHeader>
          <CardContent className="grid gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full rounded-md" />
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card className="col-span-3 h-fit">
          <CardHeader>
            <Skeleton className="h-5 w-20" />
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Skeleton className="h-3 w-16" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
            <div className="grid gap-2">
              <Skeleton className="h-3 w-16" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
