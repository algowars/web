import ProfileSettings from "@/features/settings/profile-settings/profile-settings";
import ProfileSettingsLoading from "@/features/settings/profile-settings/profile-settings-loading";
import { Suspense } from "react";

export default function SettingsProfilePage() {
  return (
    <Suspense fallback={<ProfileSettingsLoading />}>
      <ProfileSettings />
    </Suspense>
  );
}
