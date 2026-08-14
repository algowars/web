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
    <header className="grid grid-cols-12 min-h-12 flex-1">
      <div className="col-span-4 flex items-center">
        <PlayGameTimer />
      </div>
      <div className="col-span-4 flex items-center justify-center gap-3">
        <Button className="w-24" variant="secondary">
          Run
        </Button>
        <Button className="w-24">Submit</Button>
      </div>
      <div className="col-span-4 flex items-center gap-5">
        {problem ? (
          <LanguageSelect
            languages={problem.availableLanguages}
            className="hidden md:flex"
          />
        ) : null}
        {game && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="" variant="destructive" size="sm">
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
      </div>
    </header>
  );
}
