import AccountSetupForm from "@/domains/account/forms/account-setup-form";
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

  return (
    <Layout mainClassName="flex justify-center items-center py-9 px-2">
      <Card className="max-w-lg w-full">
        <CardContent>
          <AccountSetupForm />
        </CardContent>
      </Card>
    </Layout>
  );
}
