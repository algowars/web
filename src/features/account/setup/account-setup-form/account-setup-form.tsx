"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  updateUsernameSchema,
  useUpdateUsername,
} from "@/features/auth/api/update-username";
import { accountStore } from "@/features/account/account-store";
import { useRouter } from "next/navigation";
import { routerConfig } from "@/router-config";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

export default function AccountSetupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const account = accountStore((state) => state.account);

  useEffect(() => {
    if (
      account?.usernameLastChangedAt !== null &&
      account?.usernameLastChangedAt !== undefined
    ) {
      router.replace(routerConfig.dashboard.path);
    }
  }, [account?.usernameLastChangedAt, router]);

  const signupForm = useForm<z.infer<typeof updateUsernameSchema>>({
    resolver: zodResolver(updateUsernameSchema),
    defaultValues: {
      username: "",
    },
  });

  const updateUsernameMutation = useUpdateUsername({
    mutationConfig: {
      onSuccess: (account) => {
        accountStore.getState().init(account);
        toast.success("Account created successfully!");

        router.push(routerConfig.home.path);
      },
    },
  });

  function onSubmit(values: z.infer<typeof updateUsernameSchema>) {
    updateUsernameMutation.mutate({ data: values });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Finish setting up your account</CardTitle>
          <CardDescription>Please fill out the required fields</CardDescription>
        </CardHeader>
        {updateUsernameMutation.isError ? (
          <p className="text-sm text-center text-destructive px-3">
            {updateUsernameMutation.error.message}
          </p>
        ) : null}
        <CardContent>
          <Form {...signupForm}>
            <form
              onSubmit={signupForm.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={signupForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        disabled={updateUsernameMutation.isPending}
                        data-cy="username-input"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Max 36 characters. Only letters, numbers, hyphens, and
                      underscores allowed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant="outline"
                className="w-full"
                data-cy="complete-setup-btn"
                disabled={
                  updateUsernameMutation.isPending ||
                  !signupForm.formState.isValid
                }
              >
                {updateUsernameMutation.isPending
                  ? "Loading..."
                  : "Setup Account"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
