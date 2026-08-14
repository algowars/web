"use client";

import { Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

import { routerConfig } from "@/shared/router-config";
import { Button } from "@/shared/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import type { Game } from "../models/game";
import { GameStatus } from "../models/game";

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

type CompletedGameResultsDialogProps = {
  readonly game: Game;
};

export default function CompletedGameResultsDialog({
  game,
}: CompletedGameResultsDialogProps) {
  const router = useRouter();
  const startedAt = game.startedAt ? new Date(game.startedAt).getTime() : null;
  const endedAt = game.endedAt ? new Date(game.endedAt).getTime() : null;
  const durationSeconds =
    startedAt !== null && endedAt !== null
      ? Math.max(0, Math.floor((endedAt - startedAt) / 1000))
      : null;
  const isCancelled =
    game.status === GameStatus.Cancelled ||
    String(game.status) === GameStatus[GameStatus.Cancelled];
  const statusLabel = isCancelled ? "Forfeited" : "Completed";

  return (
    <AlertDialog open>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trophy className="text-primary" />
          </AlertDialogMedia>
          <AlertDialogTitle>
            {isCancelled ? "Game over" : "Game completed"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isCancelled
              ? "The game was forfeited and has ended."
              : "The game has ended. Here are the final game details."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4 rounded-md border px-3 py-2">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium">{statusLabel}</span>
          </div>
          {durationSeconds !== null ? (
            <div className="flex items-center justify-between gap-4 rounded-md border px-3 py-2">
              <span className="text-muted-foreground">Time played</span>
              <span className="font-medium tabular-nums">
                {formatDuration(durationSeconds)}
              </span>
            </div>
          ) : null}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Participants
            </p>
            <div className="space-y-2">
              {game.participants.length ? (
                game.participants
                  .slice()
                  .sort((first, second) => first.seatNumber - second.seatNumber)
                  .map((participant) => (
                    <div
                      key={participant.userId}
                      className="flex items-center justify-between rounded-md border px-3 py-2"
                    >
                      <span className="font-medium">
                        {participant.username}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {participant.score} pts · Seat {participant.seatNumber}
                      </span>
                    </div>
                  ))
              ) : (
                <p className="text-muted-foreground">No participants found.</p>
              )}
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Go back
          </Button>
          <AlertDialogAction
            onClick={() => router.push(routerConfig.home.path)}
          >
            Go home
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
