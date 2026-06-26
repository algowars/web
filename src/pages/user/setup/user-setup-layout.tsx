"use client";

import { useGetAccount } from "@/domains/user/api/get-account";
import { useUpsertUser } from "@/domains/user/api/upsert-user";
import UserSetupForm from "@/domains/user/forms/user-setup-form";
import { Card, CardContent } from "@/shared/components/ui/card";
import Layout from "@/shared/layouts/layout/layout";
import { routerConfig } from "@/shared/router-config";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function UserSetupLayout() {
  const [isUpsertDone, setIsUpsertDone] = useState(false);
  const { data: accountResponse, isLoading } = useGetAccount({
    queryConfig: {
      enabled: isUpsertDone,
    },
  });

  const { mutate } = useUpsertUser({
    mutationConfig: {
      onSuccess: () => {
        setIsUpsertDone(true);
      },
      onError: () => {
        setIsUpsertDone(true);
        toast.error("Failed to sync user");
      },
    },
  });

  const { data: userResult, isLoading: isAccountLoading } = useGetAccount({
    queryConfig: {
      enabled: isUpsertDone,
    },
  });

  const router = useRouter();

  if (isLoading || isAccountLoading) {
    return (
      <Layout mainClassName="flex justify-center items-center py-9 px-2">
        <Card className="max-w-lg w-full">
          <CardContent>
            <div className="flex justify-center items-center">
              <p>Loading...</p>
            </div>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  if (userResult?.usernameLastChangedAt) {
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
