"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Textarea } from "@/shared/components/ui/textarea";
import { useUpdateBioSettings } from "../api/update-bio-settings";
import { useSettingsStore } from "../settings-store";
import SettingsField from "../settings-field";

const profileSettingsFormSchema = z.object({
  bio: z.string().max(255, { message: "Bio must be 255 characters or fewer." }),
});

export type ProfileSettingsFormValues = z.infer<
  typeof profileSettingsFormSchema
>;

export default function ProfileSettingsForm() {
  const profile = useSettingsStore((s) => s.settings);
  const isEditing = useSettingsStore((s) => s.profileIsEditing);
  const beginEditing = useSettingsStore((s) => s.beginProfileEditing);
  const stopEditing = useSettingsStore((s) => s.stopProfileEditing);

  const updateProfileSettings = useUpdateBioSettings({
    mutationConfig: {
      onSuccess: () => stopEditing(),
    },
  });

  const form = useForm<ProfileSettingsFormValues>({
    resolver: zodResolver(profileSettingsFormSchema),
    defaultValues: { bio: "" },
  });

  useEffect(() => {
    if (profile) {
      form.reset({ bio: profile.bio });
    }
  }, [profile, form]);

  function onCancel() {
    form.reset({ bio: profile?.bio ?? "" });
    stopEditing();
  }

  return (
    <SettingsField
      label="Bio"
      value={profile?.bio}
      emptyText="No bio set."
      isEditing={isEditing}
      onEdit={beginEditing}
      onCancel={onCancel}
      onSave={form.handleSubmit((data) =>
        updateProfileSettings.mutate({ data })
      )}
      isSaving={updateProfileSettings.isPending}
      editContent={
        <FieldGroup>
          <Controller
            name="bio"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                <Textarea
                  {...field}
                  id="bio"
                  aria-invalid={fieldState.invalid}
                  placeholder="Personal bio to display on your profile"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      }
    />
  );
}
