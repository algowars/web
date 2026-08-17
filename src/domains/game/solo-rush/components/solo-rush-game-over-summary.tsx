"use client";

import { GameStatus } from "@/domains/game/models/game";
import type { GameWorkspaceProps } from "@/domains/game/models/game-workspace";
import ScoreBadge from "@/domains/game/components/score-badge";
import { selectUser } from "@/domains/user/state/user-slice";
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
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import { Home, RotateCcw, Trophy } from "lucide-react";
import Link from "next/link";
import { GameActions } from "@/domains/game/state/game-actions";
import { selectIsCreatingGame } from "@/domains/game/state/game-slice";
import { useGameCreatedRedirectListener } from "@/domains/game/hooks/use-game-created-redirect-listener";

export default function SoloRushGameOverSummary({
  game,
}: Readonly<GameWorkspaceProps>) {
  useGameCreatedRedirectListener();

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isCreating = useAppSelector(selectIsCreatingGame);
  const participant = game.participants.find(
    (candidate) => candidate.userId === user?.id
  );
  const wasForfeited = game.status === GameStatus.Cancelled;

  const playAgain = () => {
    dispatch(
      GameActions.createGameRequested({
        gameModeKey: game.gameModeKey,
        timeLimitInSeconds: game.timeLimitInSeconds,
      })
    );
  };

  return (
    <div className="flex h-full min-h-0 items-center justify-center py-6">
      <Card className="w-full max-w-md">
        <CardHeader className="justify-items-center text-center">
          <Trophy className="mb-2 size-8 text-primary" />
          <CardTitle>{wasForfeited ? "Game forfeited" : "Time's up"}</CardTitle>
          <CardDescription>
            {wasForfeited
              ? "This Solo Rush game has ended."
              : "Your Solo Rush game is complete."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ScoreBadge score={participant?.score ?? 0} />
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
