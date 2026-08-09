"use client";

import PlayCard from "./play-card";
import { Zap } from "lucide-react";
import { ComponentProps } from "react";

export default function PlaySoloRushCard(
  props: Readonly<ComponentProps<"div">>
) {
  return (
    <PlayCard
      {...props}
      color="lime"
      icon={Zap}
      header={"Solo Rush"}
      tidbit="Race the clock"
      description={
        "Solve as many problems as possible before the time runs out."
      }
      playerCount="1 player"
      time={"5 / 10 / 15 minutes"}
      type="Ranked"
      disabled={true}
      onClick={() => {
        console.log("STARTING");
      }}
    />
  );
}
