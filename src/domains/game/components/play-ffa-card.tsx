"use client";

import PlayCard from "./play-card";
import { Users } from "lucide-react";
import { ComponentProps } from "react";

export default function PlayFFACard(props: Readonly<ComponentProps<"div">>) {
  const startGame = () => {};
  return (
    <PlayCard
      {...props}
      color="lime"
      icon={Users}
      header={"FFA"}
      tidbit="Free-for-all"
      description={
        "Solve as many problems as possible before the time runs out."
      }
      playerCount={"3-10 players"}
      time={"5 / 10 / 15 / 30 minutes"}
      onClick={startGame}
      type="Practice"
      disabled={true}
    />
  );
}
