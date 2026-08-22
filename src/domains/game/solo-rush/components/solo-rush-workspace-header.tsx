"use client";

import { useQueryClient } from "@tanstack/react-query";
import ForfeitButton from "@/domains/game/components/forfeit-button";
import { LanguageSelect } from "@/domains/workspace/language-select/components/language-select";
import { KeyboardShortcutTooltip } from "@/shared/components/keyboard-shortcut-tooltip";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { ModeToggle } from "@/shared/theme/mode-toggle";
import { useKeyboardCommand } from "@/shared/hooks/use-keyboard-command";
import { ArrowRight, Menu } from "lucide-react";
import ScoreBadge from "../../components/score-badge";
import GameTimer from "../../components/game-timer";
import { gameQueryOptions } from "../../api/get-game";
import type { GameWorkspaceProps } from "../../models/game-workspace";
import { useUserStore, selectUser } from "@/domains/user/state/user-store";
import { useCallback } from "react";
import {
  useProblemSetupStore,
  selectCurrentProblem,
} from "@/domains/problem/state/problem-setup-store";
import { useProblemSetupSync } from "@/domains/problem/hooks/use-problem-setup-sync";
import {
  useWorkspaceStore,
  selectSelectedVersionId,
  selectIsSubmittingSubmission,
} from "@/domains/workspace/state/workspace-store";
import {
  useGameSessionStore,
  selectPendingNextProblemId,
  selectViewingProblemId,
} from "../../state/game-session-store";
import { useSoloRushSubmission } from "../../hooks/use-solo-rush-submission";
import { useLoadNextProblem } from "../../hooks/use-load-next-problem";

export default function SoloRushWorkspaceHeader({
  game,
}: Readonly<GameWorkspaceProps>) {
  const queryClient = useQueryClient();
  const user = useUserStore(selectUser);
  const currentProblem = useProblemSetupStore(selectCurrentProblem);
  const { setup: problemSetup, isLoading: isProblemSetupLoading } =
    useProblemSetupSync();
  const isSubmittingSubmission = useWorkspaceStore(
    selectIsSubmittingSubmission
  );
  const selectedVersionId = useWorkspaceStore(selectSelectedVersionId);
  const selectVersion = useWorkspaceStore((s) => s.selectVersion);
  const pendingNextProblemId = useGameSessionStore(selectPendingNextProblemId);
  const viewingProblemId = useGameSessionStore(selectViewingProblemId);
  const isViewingHistory = viewingProblemId !== null;

  const { submit } = useSoloRushSubmission();
  const loadNextProblem = useLoadNextProblem();

  const currentParticipant = game.participants.find(
    (participant) => participant.userId === user?.id
  );

  const onTimeExpired = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: gameQueryOptions({ gameId: game.gameId }).queryKey,
    });
  }, [queryClient, game.gameId]);

  const onSubmitSolution = () => {
    if (!currentProblem || !problemSetup) return;
    void submit({
      game,
      problemId: currentProblem.id,
      problemSetupId: problemSetup.id,
    });
  };

  const onNextProblem = () => {
    void loadNextProblem(pendingNextProblemId);
  };

  const problemSolved = pendingNextProblemId !== undefined && !isViewingHistory;
  const canSubmitSolution =
    !!problemSetup &&
    !isProblemSetupLoading &&
    !isSubmittingSubmission &&
    !problemSolved &&
    !isViewingHistory;

  useKeyboardCommand({
    key: "Enter",
    onCommand: onSubmitSolution,
    enabled: canSubmitSolution,
    modifier: "ctrl",
  });

  return (
    <header className="@container flex min-h-12 flex-1 items-center p-1">
      <div className="flex flex-1 items-center gap-2 @3xl:gap-3">
        <GameTimer game={game} onTimeExpired={onTimeExpired} />
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
        <LanguageSelect
          languages={currentProblem?.availableLanguages ?? []}
          selectedVersionId={selectedVersionId}
          onSelectVersion={selectVersion}
        />
        <ForfeitButton gameId={game.gameId} />
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
                selectedVersionId={selectedVersionId}
                onSelectVersion={selectVersion}
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
              <ForfeitButton gameId={game.gameId} />
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
