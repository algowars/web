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
    <Layout mainClassName="flex justify-center items-center py-9">
      <p>Account setup page</p>
    </Layout>
  );
}
