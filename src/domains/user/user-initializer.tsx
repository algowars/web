"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useUpsertUser } from "./api/upsert-user";
import { useEffect, useState } from "react";
import { userStore } from "./user-store";
import { toast } from "sonner";
import { useGetAccount } from "./api/get-account";

export default function UserInitializer() {
  const [isUpsertSuccessful, setIsUpsertSuccessful] = useState(false);
  const { user } = useUser();
  const initUser = userStore((state) => state.init);

  const { data: accountResponse } = useGetAccount({
    queryConfig: {
      enabled: isUpsertSuccessful,
    },
  });

  const { mutate } = useUpsertUser({
    mutationConfig: {
      onSuccess: () => {
        setIsUpsertSuccessful(true);
      },
      onError: () => {
        setIsUpsertSuccessful(false);
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
    if (accountResponse?.data) {
      initUser(accountResponse.data);
    }
  }, [accountResponse, initUser]);

  return null;
}
