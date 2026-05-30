import SidebarLayout from "@/shared/components/layouts/sidebar-layout/sidebar-layout";
import { Profile } from "./models/profile";
import { useProfileStore } from "./profile-store";
import { routerConfig } from "@/router-config";
import ProfileInfo from "./profile-info/profile-info";

type ProfileLayoutProps = {
  profile: Profile;
};

export default function ProfileLayout({ profile }: ProfileLayoutProps) {
  const initProfile = useProfileStore((s) => s.initProfile);

  initProfile(profile);

  return (
    <SidebarLayout
      breadcrumbs={[
        {
          url: routerConfig.home.path,
          name: "Home",
        },
        {
          url: routerConfig.profile.execute({
            username: profile.username,
          }),
          name: profile.username,
        },
      ]}
    >
      <ProfileInfo />
    </SidebarLayout>
  );
}
