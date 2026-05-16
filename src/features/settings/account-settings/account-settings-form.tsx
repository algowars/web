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
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "../settings-store";
import { useUpdateUsername } from "@/features/auth/api/update-username";

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

  const updateUsername = useUpdateUsername({
    mutationConfig: {
      onSuccess: () => stopEditing(),
    },
  });

  const form = useForm<AccountSettingsFormValues>({
    resolver: zodResolver(accountSettingsFormSchema),
    defaultValues: {
      username: "",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({ username: settings.username });
    }
  }, [settings, form]);

  function onSubmit(data: AccountSettingsFormValues) {
    updateUsername.mutate({ data });
  }

  function onCancel() {
    form.reset({ username: settings?.username ?? "" });
    stopEditing();
  }

  if (!isEditing) {
    const usernameValue = settings?.username;
    return (
      <div className="space-y-2">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="text-sm font-medium">Username</div>
            <div className="mt-1 text-sm">
              {usernameValue || (
                <span className="text-muted-foreground">No username set.</span>
              )}
            </div>
            {settings?.usernameLastChangedAt && (
              <div className="mt-1 text-xs text-muted-foreground">
                Last changed:{" "}
                {new Date(settings.usernameLastChangedAt).toLocaleDateString()}
              </div>
            )}
          </div>
          <Button type="button" onClick={beginEditing} variant="outline">
            Edit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <FieldDescription>
          You can&apos;t change your name for a week.
        </FieldDescription>
      </FieldGroup>
      <div className="flex gap-3 mt-4">
        <Button
          type="button"
          variant="secondary"
          className="w-24"
          onClick={onCancel}
          disabled={updateUsername.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-24"
          disabled={updateUsername.isPending}
        >
          Save
        </Button>
      </div>
    </form>
  );
}
