import LandingLayout from "@/components/layouts/landing-layout/landing-layout";
import AccountSetupForm from "@/features/account/setup/account-setup-form/account-setup-form";
import { AccountGuard } from "@/features/auth/guards/not-fully-authenticated.guard";
import { auth0 } from "@/lib/auth0";
import { routerConfig } from "@/router-config";
import { redirect } from "next/navigation";
import React from "react";

export default async function AccountSetupPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect(routerConfig.home.path);
  }

  return (
    <AccountGuard>
      <LandingLayout mainClassName="flex justify-center items-center py-9">
        <AccountSetupForm className="w-full max-w-96" />
      </LandingLayout>
    </AccountGuard>
  );
}
