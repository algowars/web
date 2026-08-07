"use client";

import GameLayout from "@/views/game-layout";
import { useGetGameByIdQuery } from "@/domains/game/api/game-api";
import { useEffect } from "react";
import { toast } from "sonner";

type Props = { gameId: string };

export default function GamePageClient({ gameId }: Readonly<Props>) {
  const { data: game, isLoading, isError, error } = useGetGameByIdQuery(gameId);

  useEffect(() => {
    if (isError) {
      const msg =
        error instanceof Error ? error.message : "Failed to load game";
      toast.error(msg);
    }
  }, [isError, error]);

  if (isLoading) return <div className="p-4">Loading game…</div>;
  if (!game) return <div className="p-4">Game not found</div>;

  return <GameLayout game={game} />;
}
