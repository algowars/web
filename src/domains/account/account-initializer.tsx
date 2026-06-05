import { useUser } from "@auth0/nextjs-auth0";
import { useUpsertAccount } from "./api/upsert-account";
import { useEffect } from "react";
import { accountStore } from "./account-store";
import { toast } from "sonner";

export default function AccountInitializer() {
  const { user } = useUser();
  const initUser = accountStore((state) => state.init);
  const { mutate } = useUpsertAccount({
    mutationConfig: {
      onSuccess: (response) => {
        initUser(response.data);
      },
      onError: () => {
        toast.error("Failed to sync account");
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

  return null;
}
