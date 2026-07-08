"use client";

import UserSetupForm from "@/domains/user/forms/user-setup-form";
import {
  selectIsUserLoading,
  selectUser,
} from "@/domains/user/state/user-slice";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import Layout from "@/shared/layouts/layout/layout";
import { routerConfig } from "@/shared/router-config";
import { useAppSelector } from "@/shared/state/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserSetupLayout() {
  const user = useAppSelector(selectUser);
  const isUserLoading = useAppSelector(selectIsUserLoading);
  const router = useRouter();

  useEffect(() => {
    if (user?.usernameLastChangedAt) {
      router.push(routerConfig.home.path);
    }
  }, [router, user?.usernameLastChangedAt]);

  if (isUserLoading) {
    return (
      <Layout mainClassName="flex justify-center items-center py-9 px-2">
        <Card className="max-w-lg w-full">
          <CardContent>
            <div className="space-y-6" aria-label="Loading setup form">
              <div className="space-y-3">
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-4 w-full" />
              </div>

              <div className="space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>

              <Skeleton className="h-9 w-28" />
            </div>
          </CardContent>
        </Card>
      </Layout>
    );
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
