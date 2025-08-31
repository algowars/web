import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import Profile from "@/features/profile/profile";
import { routerConfig } from "@/router-config";

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const resolvedParams = await Promise.resolve(params);

  if (!resolvedParams.username) {
    throw new Error("Missing username");
  }

  return (
    <SidebarLayout
      breadcrumbs={[
        {
          url: routerConfig.home.path,
          name: "Home",
        },
        {
          url: routerConfig.profile.execute({
            username: resolvedParams.username,
          }),
          name: resolvedParams.username,
        },
      ]}
      defaultOpen={false}
    >
      <div className="h-full">
        <Profile params={Promise.resolve(resolvedParams)} />
      </div>
    </SidebarLayout>
  );
}
