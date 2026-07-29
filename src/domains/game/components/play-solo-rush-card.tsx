"use client";

import { useAppSelector } from "@/shared/state/hooks";
import { findAvailableGameByName } from "../state/available-games-slice";
import PlayCard from "./play-card";
import { GameModeType } from "../models/game-mode";
import { Bolt } from "lucide-react";
import { ComponentProps } from "react";

export default function PlaySoloRushCard(
  props: Readonly<ComponentProps<"div">>
) {
  const soloRush = useAppSelector(
    findAvailableGameByName(GameModeType.SoloRush)
  );

  const startGame = () => {};
  return (
    <PlayCard
      {...props}
      color="lime"
      icon={Bolt}
      header={soloRush?.name ?? "Solo Rush"}
      tidbit="Race the clock"
      description={
        soloRush?.description ??
        "Solve as many problems as possible before the time runs out."
      }
      playerCount="1 player"
      time={"5 / 10 / 15 minutes"}
      onClick={startGame}
      type={soloRush?.isRanked ? "Ranked" : "Practice"}
    />
  );
}
