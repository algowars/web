"use client";

import { useCallback } from "react";
import GameTimer from "../../components/game-timer";
import { selectCurrentGame, selectPendingNextProblemId } from "../../state/game-slice";
import { useAppSelector, useAppDispatch } from "@/shared/state/hooks";
import { GameActions } from "../../state/game-actions";
import { ModeToggle } from "@/shared/theme/mode-toggle";
import ForfeitButton from "./forfeit-button";
import { Button } from "@/shared/components/ui/button";
import { selectIsSubmittingSubmission } from "@/domains/workspace/state/workspace-slice";
import { useKeyboardCommand } from "@/shared/hooks/use-keyboard-command";
import { KeyboardShortcutTooltip } from "@/shared/components/keyboard-shortcut-tooltip";
import ScoreBadge from "../../components/score-badge";
import { selectUser } from "@/domains/user/state/user-slice";
import { selectCurrentProblem, selectProblemSetup, selectProblemSetupLoading } from "@/domains/problem/state/problem-setup-slice";
import { LanguageSelect } from "@/domains/workspace/language-select/components/language-select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Separator } from "@/shared/components/ui/separator";
import { ArrowRight, Menu } from "lucide-react";

export default function SoloRushWorkspaceHeader() {
  const game = useAppSelector(selectCurrentGame);
  const user = useAppSelector(selectUser);
  const currentProblem = useAppSelector(selectCurrentProblem);
  const isSubmittingSubmission = useAppSelector(selectIsSubmittingSubmission);
  const isProblemSetupLoading = useAppSelector(selectProblemSetupLoading);
  const problemSetup = useAppSelector(selectProblemSetup);
  const pendingNextProblemId = useAppSelector(selectPendingNextProblemId);
  const dispatch = useAppDispatch();
  const gameId = game?.gameId;
  const currentParticipant = game?.participants.find(
    (participant) => participant.userId === user?.id
  );

  const onTimeExpired = useCallback(() => {
    if (gameId) {
      dispatch(GameActions.loadGameRequested(gameId));
    }
  }, [dispatch, gameId]);

  const onSubmitSolution = () => {
    dispatch(GameActions.submitSoloRushSolutionRequested());
  };

  const onNextProblem = () => {
    if (!pendingNextProblemId) return;
    dispatch(GameActions.nextProblemRequested({ nextProblemId: pendingNextProblemId }));
  };

  const problemSolved = pendingNextProblemId !== undefined;
  const canSubmitSolution = !!game && !!problemSetup && !isProblemSetupLoading && !isSubmittingSubmission && !problemSolved;

  useKeyboardCommand({
    key: "Enter",
    onCommand: onSubmitSolution,
    enabled: canSubmitSolution,
    modifier: "ctrl",
  });

  return (
    <header className="@container flex min-h-12 flex-1 items-center p-1">
      <div className="flex flex-1 items-center gap-2 @3xl:gap-3">
        {game ? <GameTimer game={game} onTimeExpired={onTimeExpired} /> : null}
        {currentParticipant ? (
          <ScoreBadge score={currentParticipant.score} />
        ) : null}
      </div>
      <div className="hidden flex-1 justify-center @3xl:flex">
        {problemSolved ? (
          <Button
            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={onNextProblem}
          >
            Next Problem <ArrowRight size={16} />
          </Button>
        ) : (
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
        )}
      </div>
      <div className="hidden flex-1 items-center justify-end gap-2 @3xl:flex">
        <LanguageSelect languages={currentProblem?.availableLanguages ?? []} />
        <ForfeitButton />
        <ModeToggle />
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="ml-1 -mr-1 @3xl:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>{currentProblem?.title ?? "Solo Rush"}</SheetTitle>
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-4 px-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Language
              </span>
              <LanguageSelect
                languages={currentProblem?.availableLanguages ?? []}
                className="flex-1 min-w-0"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Theme</span>
              <ModeToggle />
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">Game</span>
              <ForfeitButton />
            </div>
          </div>

          <SheetFooter className="px-4 pb-4">
            {problemSolved ? (
              <Button
                className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                onClick={onNextProblem}
              >
                Next Problem <ArrowRight size={16} />
              </Button>
            ) : (
              <KeyboardShortcutTooltip
                label="Submit solution"
                shortcut={["Ctrl", "Enter"]}
              >
                <Button
                  className="w-full"
                  disabled={!canSubmitSolution}
                  onClick={onSubmitSolution}
                >
                  {isSubmittingSubmission ? "Submitting..." : "Submit"}
                </Button>
              </KeyboardShortcutTooltip>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </header>
  );
}
