"use client";

import { useCallback } from "react";
import GameTimer from "../../components/game-timer";
import { selectCurrentGame } from "../../state/game-slice";
import { useAppSelector, useAppDispatch } from "@/shared/state/hooks";
import { GameActions } from "../../state/game-actions";
import { ModeToggle } from "@/shared/theme/mode-toggle";

export default function SoloRushWorkspaceHeader() {
  const game = useAppSelector(selectCurrentGame);
  const dispatch = useAppDispatch();
  const gameId = game?.gameId;

  const onTimeExpired = useCallback(() => {
    if (gameId) {
      dispatch(GameActions.loadGameRequested(gameId));
    }
  }, [dispatch, gameId]);

  return (
    <header className="grid grid-cols-12 min-h-12 flex-1 items-center">
      <div className="col-span-4 flex items-center">
        {game ? <GameTimer game={game} onTimeExpired={onTimeExpired} /> : null}
      </div>
      <div className="col-span-4"></div>
      <div className="col-span-4 flex items-center">
        <ModeToggle className="ml-auto" />
      </div>
    </header>
  );
}
