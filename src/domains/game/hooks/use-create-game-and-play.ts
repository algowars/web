"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateGame } from "../api/create-game";
import { routerConfig } from "@/shared/router-config";
import { GameModeKey } from "../models/game-mode";

/** Creates a game and navigates to it on success. Replaces the old
 *  createGameRequested/Success/Failure flow plus useGameCreatedRedirectListener —
 *  the mutation already gives us the created game ID directly, so there's no
 *  need to round-trip it through global state just to redirect. */
export function useCreateGameAndPlay() {
  const router = useRouter();
  const mutation = useCreateGame();

  const createGame = (args: {
    gameModeKey: GameModeKey;
    timeLimitInSeconds: number;
  }) => {
    mutation.mutate(args, {
      onSuccess: (gameId) => {
        router.push(routerConfig.gamePlay.execute({ gameId }));
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create game");
      },
    });
  };

  return { createGame, isCreating: mutation.isPending };
}
