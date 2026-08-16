"use client";

import { useEffect } from "react";
import SidebarLayout from "@/shared/layouts/sidebar-layout/sidebar-layout";
import { Button } from "@/shared/components/ui/button";

import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import { GameActions } from "@/domains/game/state/game-actions";
import {
  selectCurrentGame,
  selectGameError,
  selectIsLoadingGame,
} from "@/domains/game/state/game-slice";
import { gameWorkspaceRegistry } from "@/domains/game/game-workspace-registry";

type PlayGameContentProps = {
  gameId: string;
};

export default function PlayGameContent({
  gameId,
}: Readonly<PlayGameContentProps>) {
  const dispatch = useAppDispatch();
  const currentGame = useAppSelector(selectCurrentGame);
  const isLoading = useAppSelector(selectIsLoadingGame);
  const error = useAppSelector(selectGameError);

  useEffect(() => {
    dispatch(GameActions.loadGameRequested(gameId));
  }, [dispatch, gameId]);

  const handleRetry = () => {
    dispatch(GameActions.loadGameRequested(gameId));
  };

  const strategy = currentGame
    ? gameWorkspaceRegistry[currentGame.gameModeKey]
    : undefined;
  const Workspace = strategy?.Workspace;
  const Header = strategy?.Header;

  return (
    <SidebarLayout
      breadcrumbs={[]}
      headerItems={
        Header && currentGame ? <Header game={currentGame} /> : undefined
      }
    >
      <div className="h-full px-2 md:px-4 pb-2 md:pb-4">
        {isLoading && <div>Loading game...</div>}
        {error && (
          <div className="flex flex-col items-start gap-3">
            <div>{error}</div>
            <Button onClick={handleRetry}>Retry</Button>
          </div>
        )}
        {!isLoading && !error && currentGame && Workspace && (
          <Workspace game={currentGame} />
        )}
        {!isLoading && !error && currentGame && !Workspace && (
          <div className="text-sm text-muted-foreground">
            This game mode isn&apos;t supported yet.
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
