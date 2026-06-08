"use client";

import { useGetProfile } from "@/domains/account/api/get-profile";
import AccountSetupForm from "@/domains/account/forms/account-setup-form";
import { Card, CardContent } from "@/shared/components/ui/card";
import Layout from "@/shared/layouts/layout/layout";
import { routerConfig } from "@/shared/router-config";
import { useRouter } from "next/navigation";

export default function AccountSetupLayout() {
  const { data: accountResult } = useGetProfile({});
  const router = useRouter();

  if (accountResult?.data?.usernameLastChangedAt) {
    router.push(routerConfig.home.path);
    return null;
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
