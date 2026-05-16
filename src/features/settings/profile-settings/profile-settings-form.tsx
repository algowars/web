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
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUpdateProfileSettings } from "@/features/profile/api/update-profile-settings";
import { useSettingsStore } from "../settings-store";

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

  const updateProfileSettings = useUpdateProfileSettings({
    mutationConfig: {
      onSuccess: () => stopEditing(),
    },
  });

  const form = useForm<ProfileSettingsFormValues>({
    resolver: zodResolver(profileSettingsFormSchema),
    defaultValues: {
      bio: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({ bio: profile.bio });
    }
  }, [profile, form]);

  function onSubmit(data: ProfileSettingsFormValues) {
    updateProfileSettings.mutate({ data });
  }

  function onCancel() {
    form.reset({ bio: profile?.bio ?? "" });
    stopEditing();
  }

  if (!isEditing) {
    const bioValue = profile?.bio;
    return (
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="text-sm font-medium">Bio</div>
          <div className="mt-1 text-sm">
            {bioValue || (
              <span className="text-muted-foreground">No bio set.</span>
            )}
          </div>
        </div>
        <Button type="button" onClick={beginEditing} variant="outline">
          Edit
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <div className="flex gap-3 mt-4">
        <Button
          type="button"
          variant="secondary"
          className="w-24"
          onClick={onCancel}
          disabled={updateProfileSettings.isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-24"
          disabled={updateProfileSettings.isPending}
        >
          Save
        </Button>
      </div>
    </form>
  );
}
