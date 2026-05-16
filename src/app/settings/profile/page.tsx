import ProfileSettings from "@/features/settings/profile-settings/profile-settings";
import { Suspense } from "react";

export default function SettingsProfilePage() {
  return (
    <Suspense>
      <ProfileSettings />
    </Suspense>
  );
}
