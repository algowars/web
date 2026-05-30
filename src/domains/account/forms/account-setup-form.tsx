"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { updateUsernameSchema } from "../schemas/update-username-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";
import { routerConfig } from "@/router-config";
import { useUpdateUsername } from "../api/update-username";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
export default function AccountSetupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const finishAccountForm = useForm<z.infer<typeof updateUsernameSchema>>({
    resolver: zodResolver(updateUsernameSchema),
  });

  const updateUsernameMutation = useUpdateUsername({
    mutationConfig: {
      onSuccess: (account) => {
        toast("Account setup complete.");

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
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Error Setting Up Account</AlertTitle>
            <AlertDescription>
              {updateUsernameMutation.error.message}
            </AlertDescription>
          </Alert>
        ) : null}
        <CardContent>
          <Form {...finishAccountForm}>
            <form
              onSubmit={finishAccountForm.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={finishAccountForm.control}
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
                  !finishAccountForm.formState.isValid
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
