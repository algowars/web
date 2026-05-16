"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSettingsStore } from "../settings-store";
import { useUpdateUsernameSettings } from "../api/update-username-settings";
import SettingsField from "../settings-field";

const accountSettingsFormSchema = z.object({
  username: z.string().min(1, {
    message: "Username must be at least 1 characters.",
  }),
});

export type AccountSettingsFormValues = z.infer<
  typeof accountSettingsFormSchema
>;

export default function AccountSettingsForm() {
  const settings = useSettingsStore((s) => s.settings);
  const isEditing = useSettingsStore((s) => s.accountIsEditing);
  const beginEditing = useSettingsStore((s) => s.beginAccountEditing);
  const stopEditing = useSettingsStore((s) => s.stopAccountEditing);

  const updateUsername = useUpdateUsernameSettings({
    mutationConfig: {
      onSuccess: () => stopEditing(),
    },
  });

  const form = useForm<AccountSettingsFormValues>({
    resolver: zodResolver(accountSettingsFormSchema),
    defaultValues: { username: "" },
  });

  useEffect(() => {
    if (settings) {
      form.reset({ username: settings.username });
    }
  }, [settings, form]);

  function onCancel() {
    form.reset({ username: settings?.username ?? "" });
    stopEditing();
  }

  const description = settings?.usernameLastChangedAt
    ? `Last changed: ${new Date(settings.usernameLastChangedAt).toLocaleDateString()}`
    : undefined;

  return (
    <SettingsField
      label="Username"
      value={settings?.username}
      emptyText="No username set."
      description={description}
      isEditing={isEditing}
      onEdit={beginEditing}
      onCancel={onCancel}
      onSave={form.handleSubmit((data) => updateUsername.mutate({ data }))}
      error={updateUsername.isError ? updateUsername.error?.message : null}
      editContent={
        <FieldGroup>
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  {...field}
                  id="username"
                  aria-invalid={fieldState.invalid}
                  placeholder="username"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <FieldDescription>
            You can&apos;t change your name for a week.
          </FieldDescription>
        </FieldGroup>
      }
    />
  );
}
