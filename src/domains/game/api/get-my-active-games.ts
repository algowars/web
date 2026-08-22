import { http } from "@/shared/lib/http";
import { toAxiosConfig } from "@/shared/lib/request-config";
import type { RequestConfig } from "@/shared/lib/request-config";
import { defineQuery } from "@/shared/api/define-query";
import type { MyActiveGame } from "../models/my-active-game";

export const getMyActiveGames = ({ signal }: RequestConfig) =>
  http.get<MyActiveGame[]>("/api/v1/game/mine", toAxiosConfig({ signal }));

const myActiveGamesQuery = defineQuery({
  queryKey: () => ["my-active-games"],
  queryFn: getMyActiveGames,
});

export const myActiveGamesQueryOptions = myActiveGamesQuery.queryOptions;

/** Polls for the current user's Pending/Running games — backs the global active-game
 *  banner and the "my active games" list. No error toast: this runs continuously in
 *  the background across the whole app, so a transient failure should just retry on
 *  the next interval rather than interrupt the user. Callers must gate `queryConfig.enabled`
 *  on the user being authenticated — the endpoint 401s otherwise. */
export function useMyActiveGames(enabled: boolean) {
  return myActiveGamesQuery.useQuery({
    queryConfig: { refetchInterval: 5_000, enabled },
  });
}
