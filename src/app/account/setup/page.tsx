import LandingLayout from "@/components/layouts/landing-layout/landing-layout";
import AccountSetupForm from "@/features/account/setup/account-setup-form/account-setup-form";
import { getAccount } from "@/features/auth/api/get-account";
import { auth0 } from "@/lib/auth0";
import { routerConfig } from "@/router-config";
import { redirect } from "next/navigation";

export default async function AccountSetupPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect(routerConfig.home.path);
  }

  let account = null;
  try {
    account = await getAccount();
  } catch {}

  if (!!account?.usernameLastChangedAt) {
    redirect(routerConfig.dashboard.path);
  }

  return (
    <LandingLayout mainClassName="flex justify-center items-center py-9">
      <AccountSetupForm className="w-full max-w-96" />
    </LandingLayout>
  );
}
