"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfileSettings } from "@/features/profile/api/get-profile-settings";
import React from "react";

export default function ProfileSettings() {
  const { data, isLoading, isError } = useProfileSettings();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>Loading…</CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>Unable to load profile information.</CardContent>
      </Card>
    );
  }

  const username = data?.username ?? "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="profile-settings-username">Username</Label>
          <Input
            id="profile-settings-username"
            value={username}
            disabled
            readOnly
          />
        </div>
      </CardContent>
    </Card>
  );
}
