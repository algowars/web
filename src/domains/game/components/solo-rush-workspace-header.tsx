"use client";

import {
  selectIsAuthenticated,
  selectUserPermissions,
} from "@/domains/user/state/user-slice";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Lock, Timer, Trophy } from "lucide-react";
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
import { cn } from "@/shared/lib/utils";

type SoloRushWorkspaceHeaderProps = {
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
  endTimeMs,
  problemsSolved,
  availableLanguages,
}: Readonly<SoloRushWorkspaceHeaderProps>) => {
  const dispatch = useAppDispatch();
  const hasMounted = useHasMounted();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isSubmittingSubmission = useAppSelector(selectIsSubmittingSubmission);
  const userPermissions = useAppSelector(selectUserPermissions);

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
      </div>
    </div>
  );
};
