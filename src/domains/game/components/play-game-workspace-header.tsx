"use client";

import { ModeToggle } from "@/shared/theme/mode-toggle";
import { Button } from "@/shared/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import { GameActions } from "../state/game-actions";
import { selectCurrentGame } from "../state/game-slice";
import PlayGameTimer from "./play-game-timer";
import { LanguageSelect } from "@/domains/workspace/language-select/components/language-select";
import { selectCurrentProblem } from "@/domains/problem/state/problem-setup-slice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";

export default function PlayGameWorkspaceHeader() {
  const dispatch = useAppDispatch();
  const game = useAppSelector(selectCurrentGame);
  const problem = useAppSelector(selectCurrentProblem);

  return (
    <header className="flex min-h-12 flex-1 items-center">
      <PlayGameTimer />
      {problem ? (
        <LanguageSelect
          languages={problem.availableLanguages}
          className="ml-3 hidden md:flex"
        />
      ) : null}
      {game && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="ml-auto" variant="destructive" size="sm">
              Forfeit
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Forfeit this game?</AlertDialogTitle>
              <AlertDialogDescription>
                Your game will end immediately and cannot be resumed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() =>
                  dispatch(GameActions.forfeitGameRequested(game.gameId))
                }
              >
                Forfeit game
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <div className="ml-2">
        <ModeToggle />
      </div>
    </header>
  );
}
