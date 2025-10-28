"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAccountSettings } from "@/features/auth/api/get-account-settings";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const accountSettingsFormSchema = z.object({
  username: z.string(),
});

export default function AccountSettings({
  accessToken,
}: {
  accessToken?: string;
}) {
  const form = useForm<z.infer<typeof accountSettingsFormSchema>>({
    resolver: zodResolver(accountSettingsFormSchema),
    defaultValues: {
      username: "",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [originalUsername, setOriginalUsername] = useState("");

  const { data, isLoading, isError } = useAccountSettings({
    accessToken: accessToken ?? "",
    queryConfig: { enabled: !!accessToken },
  });

  useEffect(() => {
    if (data) {
      const username = data?.account?.username ?? "";
      setOriginalUsername(username);
      form.reset({ username });
    }
  }, [data, form]);

  function onSubmit(values: z.infer<typeof accountSettingsFormSchema>) {
    setOriginalUsername(values.username);
    setIsEditing(false);
    console.log(values);
  }

  function onStartEdit() {
    form.setValue("username", originalUsername);
    setIsEditing(true);
  }

  function onCancel() {
    form.reset({ username: originalUsername });
    setIsEditing(false);
  }

  if (!accessToken) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>Please sign in to view account settings.</CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>Loading…</CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>Error loading account settings.</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) =>
                !isEditing ? (
                  <FormItem>
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <FormLabel>Username</FormLabel>
                        <div className="mt-1 text-sm">{field.value}</div>
                      </div>
                      <div>
                        <Button
                          type="button"
                          onClick={onStartEdit}
                          variant="outline"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </FormItem>
                ) : (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2">
                        <Input placeholder="username" {...field} />
                        <div className="text-sm text-yellow-600">
                          You can&apos;t change your name for a week.
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )
              }
            />
            {isEditing && (
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-24"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-24"
                  disabled={
                    !form.getValues("username") ||
                    form.getValues("username") === originalUsername
                  }
                >
                  Save
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
