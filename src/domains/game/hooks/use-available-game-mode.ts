import { useGetAvailableGamesQuery } from "../api/game-api";
import { GameModeType } from "../models/game-mode";

/**
 * Reads a single game mode out of the `getAvailableGames` RTK Query cache.
 *
 * This intentionally does NOT copy the query result into a Redux slice —
 * RTK Query's cache is already the source of truth for this server data
 * (see https://redux.js.org/style-guide/#treat-rtk-query-cache-as-source-of-truth).
 * `selectFromResult` keeps the memoization/subscription behavior so a
 * component only re-renders when the specific mode it cares about changes,
 * not on every `getAvailableGames` update.
 */
export function useAvailableGameMode(type: GameModeType) {
  return useGetAvailableGamesQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching, error }) => ({
      gameMode: data?.find((mode) => mode.gameModeType === type),
      isLoading,
      isFetching,
      error,
    }),
  });
}
