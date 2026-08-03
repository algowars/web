"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Badge } from "@/shared/components/ui/badge";
import { CheckCircle2, Flag, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import type { GameDto } from "@/domains/game/api/game-api";

type SoloRushGameOverDialogProps = {
  game: GameDto;
  open: boolean;
};

/**
 * Forced end-of-run summary for Solo Rush: shown once the overall timer runs
 * out (or the game is otherwise no longer Active) so the player sees their
 * final score/problems-solved instead of being left staring at a locked,
 * "Time's up" editor with no clear next step.
 */
export default function SoloRushGameOverDialog({
  game,
  open,
}: Readonly<SoloRushGameOverDialogProps>) {
  const router = useRouter();
  const player = game.players[0];
  const score = player?.score ?? 0;
  const problemsSolved = player?.currentRuleStepOrder ?? 0;
  const wasForfeited = game.status === "Abandoned";

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Flag className="size-5 text-muted-foreground" />
            {wasForfeited ? "Game forfeited" : "Time's up!"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {wasForfeited
              ? "You forfeited this run."
              : "Your Solo Rush run has ended. Here's how you did."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex items-center justify-center gap-8 py-4">
          <div className="flex flex-col items-center gap-1.5">
            <Badge
              variant="secondary"
              className="gap-1.5 px-3 py-1 text-base font-semibold"
              data-cy="final-score"
            >
              <Trophy className="size-4" />
              {score}
            </Badge>
            <span className="text-xs text-muted-foreground">Final score</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Badge
              variant="outline"
              className="gap-1.5 px-3 py-1 text-base font-semibold"
              data-cy="final-problems-solved"
            >
              <CheckCircle2 className="size-4" />
              {problemsSolved}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Problems solved
            </span>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogAction
            data-cy="game-over-dashboard-btn"
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
