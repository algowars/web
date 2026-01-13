"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAccount } from "@/features/auth/account.context";
import { useProfileSettings } from "@/features/profile/api/get-profile-settings";
import React from "react";

export default function ProfileSettings({
  accessToken,
}: {
  accessToken?: string;
}) {
  const accountContext = useAccount();
  const resolvedAccessToken = accessToken ?? accountContext.accessToken;

  const { data, isLoading, isError } = useProfileSettings({
    accessToken: resolvedAccessToken ?? "",
    queryConfig: { enabled: !!resolvedAccessToken },
  });

  if (!resolvedAccessToken) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>About you</CardTitle>
        </CardHeader>
        <CardContent>Please sign in to view profile settings.</CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>About you</CardTitle>
        </CardHeader>
        <CardContent>Loading…</CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>About you</CardTitle>
        </CardHeader>
        <CardContent>Error loading profile settings.</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>About you</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 max-w-xl">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={data?.username ?? ""}
            disabled
            readOnly
          />
        </div>
      </CardContent>
    </Card>
  );
}
