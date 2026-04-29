"use client";

import { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { useUpsertAccount } from "./api/upsert-account";
import { accountStore } from "./account-store";

export default function AccountInitializer() {
  const { user, isLoading: isUserLoading } = useUser();
  const { mutate: upsertAccount } = useUpsertAccount({
    mutationConfig: {
      onSuccess: (account) => {
        accountStore.getState().init(account);
      },
      onError: () => {
        accountStore.getState().setLoading(false);
      },
    },
  });

  useEffect(() => {
    if (isUserLoading) return;

    if (user?.sub) {
      upsertAccount({ data: { imageUrl: user.picture } });
    } else {
      accountStore.getState().setLoading(false);
    }
  }, [user, isUserLoading, upsertAccount]);

  return null;
}
