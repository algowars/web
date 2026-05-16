"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSuspenseUserSettings } from "@/features/settings/api/get-user-settings";
import AccountSettingsForm from "./account-settings-form";
import { useSettingsStore } from "../settings-store";

export default function AccountSettings() {
  const { data: settings } = useSuspenseUserSettings({});
  const initSettings = useSettingsStore((s) => s.initSettings);

  if (settings) {
    initSettings(settings);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <AccountSettingsForm />
      </CardContent>
    </Card>
  );
}
