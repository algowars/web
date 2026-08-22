"use client";

import type { GameWorkspaceProps } from "@/domains/game/models/game-workspace";
import ScoreBadge from "@/domains/game/components/score-badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { useUserStore, selectUser } from "@/domains/user/state/user-store";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { routerConfig } from "@/shared/router-config";
import { Crown, Home, RotateCcw, Trophy } from "lucide-react";
import Link from "next/link";
import { useCreateGameAndPlay } from "@/domains/game/hooks/use-create-game-and-play";

/**
 * End-of-game card for the ramp workspace. Shared by every mode's strategy —
 * "Play again" just creates a new game of whatever mode/duration this one
 * was, so it works the same whether that's Solo Rush or a multiplayer lobby.
 *
 * Rendered per-participant: PlayGameContent treats a game as "over" for a
 * given player either when the whole game has finished, or when that player
 * personally forfeited (which, in a multiplayer mode, doesn't end the game
 * for anyone still playing — see Game.Forfeit on the server). So this can be
 * showing one player their forfeited-but-others-still-racing summary while
 * the rest of the table is still mid-game.
 */
export default function RampGameOverSummary({
  game,
}: Readonly<GameWorkspaceProps>) {
  const user = useUserStore(selectUser);
  const { createGame, isCreating } = useCreateGameAndPlay();
  const participant = game.participants.find(
    (candidate) => candidate.userId === user?.id
  );
  const wasForfeited = participant?.hasForfeited === true;
  const isMultiplayer = game.participants.length > 1;

  // Highest score wins — computed here rather than trusted from any single
  // participant's forfeit, since one player quitting doesn't decide the
  // outcome for everyone else still racing.
  const topScore = isMultiplayer
    ? Math.max(...game.participants.map((p) => p.score))
    : 0;
  const winners = isMultiplayer
    ? game.participants.filter((p) => p.score === topScore)
    : [];
  const isTie = winners.length > 1;
  const currentUserWon = winners.some((w) => w.userId === user?.id);

  const playAgain = () => {
    createGame({
      gameModeKey: game.gameModeKey,
      timeLimitInSeconds: game.timeLimitInSeconds,
    });
  };

  const title = wasForfeited ? "Game forfeited" : "Time's up";
  const description = !isMultiplayer
    ? wasForfeited
      ? "This game has ended."
      : "Your game is complete."
    : isTie
      ? currentUserWon
        ? `Tied for first at ${topScore} point${topScore === 1 ? "" : "s"}.`
        : `${winners.map((w) => w.username).join(" and ")} tied for first at ${topScore} point${topScore === 1 ? "" : "s"}.`
      : currentUserWon
        ? "You won!"
        : `${winners[0].username} won with ${topScore} point${topScore === 1 ? "" : "s"}.`;

  return (
    <div className="flex h-full min-h-0 items-center justify-center py-6">
      <Card className="w-full max-w-md">
        <CardHeader className="justify-items-center text-center">
          <Trophy className="mb-2 size-8 text-primary" />
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <ScoreBadge score={participant?.score ?? 0} />

          {isMultiplayer ? (
            <ul className="flex w-full flex-col gap-1.5">
              {[...game.participants]
                .sort((a, b) => b.score - a.score)
                .map((p) => (
                  <li
                    key={p.userId}
                    className="flex items-center gap-2 rounded-md border bg-muted/30 px-2 py-1.5"
                  >
                    <Avatar size="sm">
                      <AvatarImage src={p.imageUrl} alt={p.username} />
                      <AvatarFallback>
                        {p.username?.[0]?.toUpperCase() ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 truncate text-sm font-medium">
                      {p.username}
                      {p.userId === user?.id ? " (You)" : ""}
                      {p.hasForfeited ? " — forfeited" : ""}
                    </span>
                    {p.score === topScore ? (
                      <Crown
                        size={14}
                        className="text-amber-600 dark:text-amber-400"
                      />
                    ) : null}
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {p.score}
                    </span>
                  </li>
                ))}
            </ul>
          ) : null}
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-2">
          <Button variant="outline" asChild>
            <Link href={routerConfig.home.path}>
              <Home />
              Home
            </Link>
          </Button>
          <Button disabled={isCreating} onClick={playAgain}>
            <RotateCcw />
            {isCreating ? "Starting..." : "Play again"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
