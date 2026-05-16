"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSuspenseUserSettings } from "@/features/settings/api/get-user-settings";
import ProfileSettingsForm from "./profile-settings-form";
import { useSettingsStore } from "../settings-store";

export default function ProfileSettings() {
  const { data: settings } = useSuspenseUserSettings({});
  const initSettings = useSettingsStore((s) => s.initSettings);

  if (settings) {
    initSettings(settings);
  }

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
