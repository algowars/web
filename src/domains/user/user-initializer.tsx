"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useUpsertUser } from "./api/upsert-user";
import { useEffect, useState } from "react";
import { userStore } from "./user-store";
import { toast } from "sonner";
import { useGetAccount } from "./api/get-account";

export default function UserInitializer() {
  const [isUpsertDone, setIsUpsertDone] = useState(false);
  const { user } = useUser();
  const initUser = userStore((state) => state.init);
  const setIsUserLoading = userStore((state) => state.setUserLoading);

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

  useEffect(() => {
    if (user) {
      mutate({
        data: user,
      });
    }
  }, [user, mutate]);

  useEffect(() => {
    if (accountResponse) {
      initUser(accountResponse);
    }
  }, [accountResponse, initUser]);

  useEffect(() => {
    setIsUserLoading(isLoading);
  }, [isLoading, setIsUserLoading]);

  return null;
}
