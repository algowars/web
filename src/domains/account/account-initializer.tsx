import { useUser } from "@auth0/nextjs-auth0";
import { useUpsertAccount } from "./api/upsert-account";
import { useEffect } from "react";

export default function AccountInitializer() {
  const { user } = useUser();
  const initUser = useAccount;
  const { mutate } = useUpsertAccount({
    mutationConfig: {
      onSuccess: (account) => {},
    },
  });

  useEffect(() => {
    if (user) {
      mutate({
        user,
      });
    }
  }, [user, mutate]);

  return null;
}
