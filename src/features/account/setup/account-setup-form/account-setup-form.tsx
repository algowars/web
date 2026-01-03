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
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createAccountSchema,
  useCreateAccount,
} from "@/features/auth/api/create-account";
import { useAccount } from "@/features/auth/account.context";
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
import { getAccessToken } from "@auth0/nextjs-auth0";

export default function AccountSetupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { auth0, refreshAccount } = useAccount();

  const signupForm = useForm<z.infer<typeof createAccountSchema>>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      username: "",
      imageUrl: auth0.user?.picture,
    },
  });

  const createAccountMutation = useCreateAccount({
    mutationConfig: {
      onSuccess: (account) => {
        toast.success("Account created successfully!", {
          description: `Welcome, ${account.username}!`,
        });
        refreshAccount();

        router.push(routerConfig.home.path);
      },
    },
  });

  async function onSubmit(values: z.infer<typeof createAccountSchema>) {
    try {
      const accessToken = await getAccessToken();

      createAccountMutation.mutate({
        data: values,
        accessToken,
      });
    } catch {
      toast.error("Authentication error", {
        description: "Unable to get access token. Please try logging in again.",
      });
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Finish setting up your account</CardTitle>
          <CardDescription>Please fill out the required fields</CardDescription>
        </CardHeader>
        {createAccountMutation.isError ? (
          <p className="text-sm text-center text-destructive px-3">
            {createAccountMutation.error.message}
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
                        disabled={createAccountMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Max 16 characters. Only letters, numbers, hyphens, and
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
                disabled={
                  createAccountMutation.isPending ||
                  !signupForm.formState.isValid
                }
              >
                {createAccountMutation.isPending
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
