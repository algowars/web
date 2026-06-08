import { getProfile } from "@/domains/account/api/get-profile";
import AccountSetupForm from "@/domains/account/forms/account-setup-form";
import AccountSetupLayout from "@/pages/account/setup/account-setup-layout";
import { Card, CardContent } from "@/shared/components/ui/card";
import Layout from "@/shared/layouts/layout/layout";
import { auth0 } from "@/shared/lib/auth0";
import { routerConfig } from "@/shared/router-config";
import { redirect } from "next/navigation";

export default async function AccountSetupPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect(routerConfig.home.path);
  }

  return <AccountSetupLayout />;
}
