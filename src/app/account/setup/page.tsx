import LandingLayout from "@/components/layouts/landing-layout/landing-layout";
import AccountSetupForm from "@/features/account/setup/account-setup-form/account-setup-form";
import React from "react";

export default function AccountSetupPage() {
  return (
    <LandingLayout mainClassName="flex justify-center items-center py-9">
      <AccountSetupForm className="w-full max-w-96" />
    </LandingLayout>
  );
}
