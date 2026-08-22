"use client";

import { Crown } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { useUserStore, selectUser } from "@/domains/user/state/user-store";
import type { Game } from "../../models/game";

type RampStandingsProps = {
  game: Game;
};

/**
 * Live standings for the ramp workspace's "Score" tab, sorted highest score first — so a
 * player can check who's ahead mid-game, not just at the end (RampGameOverSummary already
 * shows the same ranked list there). "Live" is relative: it reflects whatever the game query
 * currently has, refreshed by the player's own actions, window refocus, and the periodic poll
 * useGameSession now also runs while Running — not a real-time push per point scored by
 * someone else.
 */
export default function RampStandings({ game }: Readonly<RampStandingsProps>) {
  const user = useUserStore(selectUser);

  const sorted = [...game.participants].sort((a, b) => b.score - a.score);
  const topScore = sorted[0]?.score ?? 0;

  return (
    <div className="flex h-full min-h-0 flex-col gap-2 overflow-y-auto p-4">
      {sorted.map((participant, index) => (
        <div
          key={participant.userId}
          className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2"
        >
          <span className="w-5 shrink-0 text-center text-sm font-semibold text-muted-foreground">
            {index + 1}
          </span>
          <Avatar size="sm">
            <AvatarImage
              src={participant.imageUrl}
              alt={participant.username}
            />
            <AvatarFallback>
              {participant.username?.[0]?.toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
          <span className="flex-1 truncate text-sm font-medium">
            {participant.username}
            {participant.userId === user?.id ? " (You)" : ""}
            {participant.hasForfeited
              ? " — forfeited"
              : participant.hasFinishedProblems
                ? " — finished"
                : ""}
          </span>
          {participant.score === topScore ? (
            <Crown size={14} className="text-amber-600 dark:text-amber-400" />
          ) : null}
          <span className="text-sm font-semibold tabular-nums">
            {participant.score}
          </span>
        </div>
      ))}
    </div>
  );
}
