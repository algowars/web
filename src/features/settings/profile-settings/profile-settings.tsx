"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSuspenseProfileSettings } from "@/features/profile/api/get-profile-settings";
import { useProfileSettingsStore } from "../profile-settings-store";
import ProfileSettingsForm from "./profile-settings-form";

export default function ProfileSettings() {
  const { data: profileSettings } = useSuspenseProfileSettings({});
  const initProfile = useProfileSettingsStore((s) => s.initProfile);

  useEffect(() => {
    if (profileSettings) {
      initProfile(profileSettings);
    }
  }, [profileSettings, initProfile]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <ProfileSettingsForm />
      </CardContent>
    </Card>
  );
}
