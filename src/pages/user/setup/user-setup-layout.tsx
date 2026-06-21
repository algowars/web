"use client";

import { useGetProfile } from "@/domains/user/api/get-profile";
import UserSetupForm from "@/domains/user/forms/user-setup-form";
import { Card, CardContent } from "@/shared/components/ui/card";
import Layout from "@/shared/layouts/layout/layout";
import { routerConfig } from "@/shared/router-config";
import { useRouter } from "next/navigation";

export default function UserSetupLayout() {
  const { data: userResult } = useGetProfile({});
  const router = useRouter();

  if (userResult?.data?.usernameLastChangedAt) {
    router.push(routerConfig.home.path);
    return null;
  }

  return (
    <Layout mainClassName="flex justify-center items-center py-9 px-2">
      <Card className="max-w-lg w-full">
        <CardContent>
          <UserSetupForm />
        </CardContent>
      </Card>
    </Layout>
  );
}
