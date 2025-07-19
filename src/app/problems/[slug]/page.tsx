import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import Problem from "@/features/problem/problem";
import { routerConfig } from "@/router-config";

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await Promise.resolve(params);

  if (!resolvedParams.slug) {
    throw new Error("Missing slug");
  }

  return (
    <SidebarLayout
      breadcrumbs={[
        {
          url: routerConfig.home.path,
          name: "Home",
        },
        {
          url: routerConfig.problems.path,
          name: "Problems",
        },
        {
          url: routerConfig.problem.execute({ slug: resolvedParams.slug }),
          name: resolvedParams.slug,
        },
      ]}
      defaultOpen={false}
    >
      <div className="h-full px-3">
        <Problem params={Promise.resolve(resolvedParams)} />
      </div>
    </SidebarLayout>
  );
}
