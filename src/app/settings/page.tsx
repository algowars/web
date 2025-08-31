import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import Settings from "@/features/settings/settings";
import { routerConfig } from "@/router-config";

export default function SettingsPage() {
  return (
    <SidebarLayout
      breadcrumbs={[
        {
          url: routerConfig.home.path,
          name: "Home",
        },
        {
          url: routerConfig.profileSettings.path,
          name: "Settings",
        },
      ]}
      defaultOpen={false}
    >
      <div className="h-full">
        <Settings />
      </div>
    </SidebarLayout>
  );
}
