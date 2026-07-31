"use client";

import { useAppSelector } from "@/shared/state/hooks";
import { findAvailableGameByName } from "../state/available-games-slice";
import PlayCard from "./play-card";
import { GameModeType } from "../models/game-mode";
import { Bolt } from "lucide-react";
import { ComponentProps } from "react";

export default function PlayFFACard(props: Readonly<ComponentProps<"div">>) {
  const ffa = useAppSelector(findAvailableGameByName(GameModeType.FFA));

  const startGame = () => {};
  return (
    <PlayCard
      {...props}
      color="lime"
      icon={Bolt}
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
