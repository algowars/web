"use client";

import PlayCard from "./play-card";
import { Swords } from "lucide-react";
import { ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { routerConfig } from "@/shared/router-config";
import { GameModeKey } from "../models/game-mode";

export default function PlayDuelCard(props: Readonly<ComponentProps<"div">>) {
  const router = useRouter();

  const goToLobbies = () => {
    router.push(routerConfig.games.execute({ mode: GameModeKey.Duel }));
  };

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
      onClick={goToLobbies}
      type="Ranked"
    />
  );
}
