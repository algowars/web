"use client";

import {
  selectIsAuthenticated,
  selectUserPermissions,
} from "@/domains/user/state/user-slice";
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
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Flag, Lock, Timer, Trophy } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import { WorkspaceEvents } from "@/domains/workspace/state/workspace-events";
import { selectIsSubmittingSubmission } from "@/domains/workspace/state/workspace-slice";
import { LanguageSelect } from "@/domains/workspace/language-select/components/language-select";
import type { ProgrammingLanguage } from "@/domains/language/models/programming-language";
import { ModeToggle } from "@/shared/theme/mode-toggle";
import { Permissions } from "@/shared/lib/permissions";
import { useHasMounted } from "@/shared/hooks/use-has-mounted";
import {
  formatCountdown,
  useCountdownSeconds,
} from "@/domains/game/hooks/use-countdown-seconds";
import { useForfeitGameMutation } from "@/domains/game/api/game-api";
import { cn } from "@/shared/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type SoloRushWorkspaceHeaderProps = {
  /** Id of the game currently in play, so the player can forfeit it. */
  gameId: string;
  /** Milliseconds since epoch at which the overall game timer expires. */
  endTimeMs: number;
  /** Number of problems the player has solved so far. */
  problemsSolved: number;
  /** Languages available for the currently active problem. */
  availableLanguages: ProgrammingLanguage[];
};

/**
 * Header for the Solo Rush game workspace. Unlike the standalone problem
 * workspace header, a game problem doesn't carry a full `Problem` model
 * (language options, slug for submission history, etc.), so this only
 * exposes the Run/Submit actions relevant while playing a game, plus the
 * overall countdown timer and the player's solved-problem count.
 */
export const SoloRushWorkspaceHeader = ({
  gameId,
  endTimeMs,
  problemsSolved,
  availableLanguages,
}: Readonly<SoloRushWorkspaceHeaderProps>) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const hasMounted = useHasMounted();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isSubmittingSubmission = useAppSelector(selectIsSubmittingSubmission);
  const userPermissions = useAppSelector(selectUserPermissions);
  const [forfeitGame, { isLoading: isForfeiting }] = useForfeitGameMutation();
  const [isForfeitDialogOpen, setIsForfeitDialogOpen] = useState(false);

  const remainingSeconds = useCountdownSeconds(endTimeMs);
  const isTimeUp = remainingSeconds !== null && remainingSeconds <= 0;
  const isTimeLow = remainingSeconds !== null && remainingSeconds <= 60;

  const canRunCode = userPermissions.includes(Permissions.SUBMISSION_CREATE);

  // Auth/permission state only exists in the client-side Redux store, so it
  // legitimately differs between the SSR pass and the client's first render.
  // Disabling actions until mounted keeps the `disabled` attribute stable
  // across hydration instead of causing a mismatch.
  const actionsDisabled =
    !hasMounted ||
    !isAuthenticated ||
    isSubmittingSubmission ||
    !canRunCode ||
    isTimeUp;
  const showLock = !hasMounted || !isAuthenticated;

  const runLabel = isSubmittingSubmission ? "Running..." : "Run";
  const submitLabel = isSubmittingSubmission ? "Submitting..." : "Submit";

  const handleForfeit = async () => {
    try {
      await forfeitGame(gameId).unwrap();
      setIsForfeitDialogOpen(false);
      router.push("/dashboard");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to forfeit game";
      toast.error(message);
    }
  };

  return (
    <div className="p-1 flex flex-1 items-center gap-2">
      <div className="flex items-center gap-2">
        <Badge
          variant={isTimeUp ? "destructive" : "secondary"}
          className={cn(
            "gap-1.5 font-mono text-sm",
            isTimeLow && !isTimeUp && "text-destructive"
          )}
          data-cy="game-timer"
        >
          <Timer className="size-3.5" />
          {remainingSeconds === null
            ? "--:--"
            : isTimeUp
              ? "Time's up"
              : formatCountdown(remainingSeconds)}
        </Badge>
        <Badge variant="outline" className="gap-1.5" data-cy="problems-solved">
          <Trophy className="size-3.5" />
          {problemsSolved} solved
        </Badge>
      </div>

      <div className="flex flex-1 items-center justify-end gap-1">
        <Button
          className="w-24"
          data-cy="run-btn"
          variant="secondary"
          disabled={actionsDisabled}
          onClick={() => dispatch(WorkspaceEvents.runCodeRequested())}
        >
          {showLock ? <Lock /> : null} {runLabel}
        </Button>
        <Button
          className="w-24"
          data-cy="submit-btn"
          disabled={actionsDisabled}
          onClick={() => dispatch(WorkspaceEvents.submitCodeRequested())}
        >
          {showLock ? <Lock /> : null} {submitLabel}
        </Button>
        <LanguageSelect languages={availableLanguages} />
        <ModeToggle />
        <AlertDialog open={isForfeitDialogOpen} onOpenChange={setIsForfeitDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              data-cy="forfeit-btn"
              disabled={!hasMounted || !isAuthenticated || isTimeUp}
            >
              <Flag /> Forfeit
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Forfeit this game?</AlertDialogTitle>
              <AlertDialogDescription>
                You&apos;ll lose your current progress and this game will end
                immediately. This can&apos;t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                data-cy="forfeit-confirm-btn"
                disabled={isForfeiting}
                onClick={handleForfeit}
              >
                {isForfeiting ? "Forfeiting..." : "Forfeit"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
