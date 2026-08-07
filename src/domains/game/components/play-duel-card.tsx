"use client";

import { useAvailableGameMode } from "../hooks/use-available-game-mode";
import PlayCard from "./play-card";
import { GameModeType } from "../models/game-mode";
import { Swords } from "lucide-react";
import { ComponentProps } from "react";

export default function PlayDuelCard(props: Readonly<ComponentProps<"div">>) {
  const { gameMode: duel } = useAvailableGameMode(GameModeType.OneVsOne);

  const startGame = () => {};
  return (
    <PlayCard
      {...props}
      color="sky"
      icon={Swords}
      header={duel?.name ?? "Duel"}
      tidbit="Head-to-head battle"
      description={
        duel?.description ?? "Challenge your opponent in a one-on-one duel."
      }
      playerCount="2 players"
      time={"5 / 10 / 15 minutes"}
      onClick={startGame}
      type={duel?.isRanked ? "Ranked" : "Practice"}
      disabled={!duel}
    />
  );
}
