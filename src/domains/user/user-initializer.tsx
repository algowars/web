import { useUser } from "@auth0/nextjs-auth0";
import { useUpsertUser } from "./api/upsert-user";
import { useEffect } from "react";
import { userStore } from "./user-store";
import { toast } from "sonner";

export default function UserInitializer() {
  const { user } = useUser();
  const initUser = userStore((state) => state.init);
  const { mutate } = useUpsertUser({
    mutationConfig: {
      onSuccess: (response) => {
        initUser(response.data);
      },
      onError: () => {
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

  return null;
}
