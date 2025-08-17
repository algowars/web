"use client";

import LandingLayout from "@/components/layouts/landing-layout/landing-layout";
import PageLoader from "@/components/loader/page-loader/page-loader";
import AccountSetupForm from "@/features/account/setup/account-setup-form/account-setup-form";
import { PartiallyAuthenticatedAuthGuard } from "@/features/auth/guards/partially-authenticated-auth.guard";
import React from "react";

export default function AccountSetupPage() {
  return (
    <PartiallyAuthenticatedAuthGuard
      authOptions={{ onRedirecting: () => <PageLoader /> }}
    >
      <LandingLayout mainClassName="flex justify-center items-center py-9">
        <AccountSetupForm className="w-full max-w-96" />
      </LandingLayout>
    </PartiallyAuthenticatedAuthGuard>
  );
}
