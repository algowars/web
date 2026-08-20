"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useUpsertUser } from "../api/upsert-user";
import { accountQueryOptions } from "../api/get-account";
import { useUserStore } from "../state/user-store";

/**
 * Runs the "sync app-level user profile" flow: PUT /user (upsert, idempotent) then
 * GET /user (account). Mirrors the old `syncUser` listener effect — the PUT can fail
 * transiently (e.g. the API cold-starting) without the account itself being missing,
 * so a failed upsert still falls through to the GET; only if both fail does the
 * sidebar end up with no user to show.
 */
export function useUserSync() {
  const queryClient = useQueryClient();
  const { mutateAsync: upsertUser } = useUpsertUser();
  const userSyncStarted = useUserStore((s) => s.userSyncStarted);
  const userSyncFailed = useUserStore((s) => s.userSyncFailed);
  const userLoaded = useUserStore((s) => s.userLoaded);
  const userLoadFailed = useUserStore((s) => s.userLoadFailed);

  const syncUser = useCallback(
    async (sub: string | undefined) => {
      if (!sub) {
        const message = "Missing user subject in auth payload";
        userSyncFailed(message);
        userLoadFailed(message);
        return;
      }

      userSyncStarted();

      try {
        await upsertUser({ sub });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to sync user";
        userSyncFailed(message);
        toast.error(message);
      }

      try {
        const account = await queryClient.fetchQuery({
          ...accountQueryOptions({}),
          staleTime: 0,
        });
        userLoaded(account);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load your profile";
        userLoadFailed(message);
      }
    },
    [queryClient, upsertUser, userSyncStarted, userSyncFailed, userLoaded, userLoadFailed]
  );

  const retrySync = useCallback(() => {
    const sub = useUserStore.getState().authProfile?.sub;
    void syncUser(sub);
  }, [syncUser]);

  return { syncUser, retrySync };
}
