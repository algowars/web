import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
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
        <h1>SETTINGS</h1>
      </div>
    </SidebarLayout>
  );
}
