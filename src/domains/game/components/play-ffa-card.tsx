"use client";

import { useAvailableGameMode } from "../hooks/use-available-game-mode";
import PlayCard from "./play-card";
import { GameModeType } from "../models/game-mode";
import { Users } from "lucide-react";
import { ComponentProps } from "react";

export default function PlayFFACard(props: Readonly<ComponentProps<"div">>) {
  const { gameMode: ffa } = useAvailableGameMode(GameModeType.FFA);

  const startGame = () => {};
  return (
    <PlayCard
      {...props}
      color="lime"
      icon={Users}
      header={ffa?.name ?? "FFA"}
      tidbit="Free-for-all"
      description={
        ffa?.description ??
        "Solve as many problems as possible before the time runs out."
      }
      playerCount={
        ffa?.minPlayers && ffa.maxPlayers
          ? `${ffa?.minPlayers}-${ffa?.maxPlayers}`
          : "3-10 players"
      }
      time={"5 / 10 / 15 / 30 minutes"}
      onClick={startGame}
      type={ffa?.isRanked ? "Ranked" : "Practice"}
      disabled={!ffa}
    />
  );
}
