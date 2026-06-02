"use client";

import { useForm } from "@tanstack/react-form";
import { accountSetupSchema } from "../schemas/account-setup-schema";

export default function AccountSetupForm() {
  const form = useForm({
    defaultValues: {
      username: "",
    },
    validators: {
      onSubmit: accountSetupSchema,
    },
    onSubmit: async ({ values }) => {},
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    ></form>
  );
}
