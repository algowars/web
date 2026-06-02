"use client";

import { useForm } from "@tanstack/react-form";
import { accountSetupSchema } from "../schemas/account-setup-schema";
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

export default function AccountSetupForm() {
  const form = useForm({
    defaultValues: {
      username: "",
    },
    validators: {
      onSubmit: accountSetupSchema,
    },
    onSubmit: async ({ value }) => {
      void value;
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
          <FieldLegend>Finish Setting Up Your Account</FieldLegend>
          <FieldDescription>
            Set you username to finish setting up your account.
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
                      data-testid="account-setup-username"
                    />
                    <FieldDescription>
                      A username must be at least 1 character, at most 36
                      characters, and contain only letters, numbers, hyphens,
                      and underscores.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </FieldSet>
        <Field orientation="horizontal">
          <Button type="submit">Save Changes</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
