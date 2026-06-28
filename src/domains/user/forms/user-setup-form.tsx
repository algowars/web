"use client";

import { useForm } from "@tanstack/react-form";
import { userSetupSchema } from "../schemas/user-setup-schema";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";
import { routerConfig } from "@/shared/router-config";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import { UserEvents } from "../state/user-events";
import {
  selectIsUserLoading,
  selectUser,
  selectUserError,
} from "../state/user-slice";
import { useEffect } from "react";

export default function UserSetupForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isPending = useAppSelector(selectIsUserLoading);
  const error = useAppSelector(selectUserError);

  useEffect(() => {
    if (user?.usernameLastChangedAt) {
      router.push(routerConfig.home.path);
    }
  }, [router, user?.usernameLastChangedAt]);

  const form = useForm({
    defaultValues: {
      username: "",
    },
    validators: {
      onSubmit: userSetupSchema,
    },
    onSubmit: async ({ value }) => {
      dispatch(UserEvents.updateUsernameRequested({ data: value }));
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Finish Setting Up Your User</FieldLegend>
          <FieldDescription>
            Set you username to finish setting up your user.
          </FieldDescription>
          <FieldGroup>
            <form.Field name="username">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Username"
                      autoComplete="off"
                      aria-invalid={isInvalid}
                      data-testid="user-setup-username"
                    />
                    <FieldDescription>
                      A username must be at least 1 character, at most 36
                      characters, and contain only letters, numbers, hyphens,
                      and underscores.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                    {error && <FieldError errors={[{ message: error }]} />}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </FieldSet>
        <Field orientation="horizontal">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
