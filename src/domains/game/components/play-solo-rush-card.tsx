"use client";

import { useAppSelector } from "@/shared/state/hooks";
import { findAvailableGameByName } from "../state/available-games-slice";
import PlayCard from "./play-card";
import { GameModeType } from "../models/game-mode";
import { Zap } from "lucide-react";
import { ComponentProps } from "react";
import { useCreateLobbyMutation, useSetLobbyReadyMutation, useStartGameMutation } from "../api/game-api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PlaySoloRushCard(
  props: Readonly<ComponentProps<"div">>
) {
  const soloRush = useAppSelector(
    findAvailableGameByName(GameModeType.SoloRush)
  );

  const router = useRouter();
  const [createLobby] = useCreateLobbyMutation();
  const [setLobbyReady] = useSetLobbyReadyMutation();
  const [startGame] = useStartGameMutation();

  const handleStart = async () => {
    if (!soloRush) {
      toast.error("Game mode unavailable");
      return;
    }

    try {
      const lobby = await createLobby({ gameModeId: soloRush.id }).unwrap();
      // For Solo Rush (capacity 1), host must mark ready — mark host ready so lobby becomes Ready
      await setLobbyReady({ lobbyId: lobby.id, body: { isReady: true } }).unwrap();
      const game = await startGame({ lobbyId: lobby.id }).unwrap();

      router.push(`/game/${encodeURIComponent(game.id)}`);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to start game";
      toast.error(message);
    }
  };

  return (
    <PlayCard
      {...props}
      color="lime"
      icon={Zap}
      header={soloRush?.name ?? "Solo Rush"}
      tidbit="Race the clock"
      description={
        soloRush?.description ??
        "Solve as many problems as possible before the time runs out."
      }
      playerCount="1 player"
      time={"5 / 10 / 15 minutes"}
      onClick={handleStart}
      type={soloRush?.isRanked ? "Ranked" : "Practice"}
      disabled={!soloRush}
    />
  );
}
