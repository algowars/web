"use client";

import PlayCard from "./play-card";
import { Swords } from "lucide-react";
import { ComponentProps } from "react";

export default function PlayDuelCard(props: Readonly<ComponentProps<"div">>) {
  const startGame = () => {};
  return (
    <PlayCard
      {...props}
      color="sky"
      icon={Swords}
      header={"Duel"}
      tidbit="Head-to-head battle"
      description={"Challenge your opponent in a one-on-one duel."}
      playerCount="2 players"
      time={"5 / 10 / 15 minutes"}
      onClick={startGame}
      type="Practice"
      disabled={true}
    />
  );
}
