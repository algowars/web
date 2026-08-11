"use client";

import { Trophy } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { useAppSelector } from "@/shared/state/hooks";
import { selectCurrentGame } from "../state/game-slice";

export default function GameProgressPanel() {
  const game = useAppSelector(selectCurrentGame);

  if (!game) {
    return null;
  }

  return (
    <div className="space-y-4 p-4">
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <Trophy className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Leaderboard</h2>
        </div>
        <div className="space-y-2">
          {game.participants
            .slice()
            .sort((first, second) => second.score - first.score)
            .map((participant, index) => (
              <div
                key={participant.userId}
                className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {index + 1}. {participant.username}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    Current problem:{" "}
                    {participant.currentProblem?.problemId ?? "Finished"}
                  </p>
                </div>
                <Badge variant={index === 0 ? "default" : "secondary"}>
                  {participant.score} pts
                </Badge>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
