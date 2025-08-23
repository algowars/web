import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { routerConfig } from "@/router-config";

export default async function AdminProblemPage({
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
          url: routerConfig.admin.path,
          name: "Admin",
        },
        {
          url: routerConfig.adminProblem.execute({ slug: resolvedParams.slug }),
          name: resolvedParams.slug,
        },
      ]}
      defaultOpen={false}
    >
      <div className="h-full px-3">{resolvedParams.slug}</div>
    </SidebarLayout>
  );
}
