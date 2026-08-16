"use client";

import { useCallback } from "react";
import GameTimer from "../../components/game-timer";
import { selectCurrentGame } from "../../state/game-slice";
import { useAppSelector, useAppDispatch } from "@/shared/state/hooks";
import { GameActions } from "../../state/game-actions";
import { ModeToggle } from "@/shared/theme/mode-toggle";
import ForfeitButton from "./forfeit-button";
import { Button } from "@/shared/components/ui/button";
import { selectIsSubmittingSubmission } from "@/domains/workspace/state/workspace-slice";
import { useKeyboardCommand } from "@/shared/hooks/use-keyboard-command";
import { KeyboardShortcutTooltip } from "@/shared/components/keyboard-shortcut-tooltip";

export default function SoloRushWorkspaceHeader() {
  const game = useAppSelector(selectCurrentGame);
  const isSubmittingSubmission = useAppSelector(selectIsSubmittingSubmission);
  const dispatch = useAppDispatch();
  const gameId = game?.gameId;

  const onTimeExpired = useCallback(() => {
    if (gameId) {
      dispatch(GameActions.loadGameRequested(gameId));
    }
  }, [dispatch, gameId]);

  const onSubmitSolution = () => {
    dispatch(GameActions.submitSoloRushSolutionRequested());
  };

  const canSubmitSolution = !!game && !isSubmittingSubmission;

  useKeyboardCommand({
    key: "Enter",
    onCommand: onSubmitSolution,
    enabled: canSubmitSolution,
    modifier: "ctrl",
  });

  return (
    <header className="grid grid-cols-12 min-h-12 flex-1 items-center">
      <div className="col-span-4 flex items-center">
        {game ? <GameTimer game={game} onTimeExpired={onTimeExpired} /> : null}
      </div>
      <div className="col-span-4 flex justify-center">
        <KeyboardShortcutTooltip
          label="Submit solution"
          shortcut={["Ctrl", "Enter"]}
        >
          <Button
            className="w-24"
            disabled={!canSubmitSolution}
            onClick={onSubmitSolution}
          >
            {isSubmittingSubmission ? "Submitting..." : "Submit"}
          </Button>
        </KeyboardShortcutTooltip>
      </div>
      <div className="col-span-4 flex items-center justify-end gap-3">
        <ForfeitButton />
        <ModeToggle />
      </div>
    </header>
  );
}
