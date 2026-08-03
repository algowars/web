import { useGetGameProblemSubmissionQuery } from "@/domains/game/api/game-api";
import CodeBlock from "@/shared/code-block/code-block";
import { Loader2 } from "lucide-react";

type SoloRushHistoryCodeViewProps = {
  gameId: string;
  problemId: string;
};

/**
 * Read-only view of the code a player used to solve a *previous* Solo Rush
 * step. Deliberately bypasses the live `workspace`/`problemSetup` Redux
 * slices (which back the editable editor for the problem currently in
 * play) so browsing history can never clobber in-progress work.
 */
export default function SoloRushHistoryCodeView({
  gameId,
  problemId,
}: Readonly<SoloRushHistoryCodeViewProps>) {
  const {
    data: submission,
    isLoading,
    isError,
  } = useGetGameProblemSubmissionQuery({ gameId, problemId });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading your solution…
      </div>
    );
  }

  if (isError || !submission) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Couldn&apos;t find your solution for this problem.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-2 p-2">
      <div className="text-xs text-muted-foreground">
        Solved with{" "}
        <span className="font-medium text-foreground">
          {submission.language.name} ({submission.language.version})
        </span>
      </div>
      <CodeBlock
        code={submission.code}
        language={submission.language.name}
        className="h-full flex-1"
      />
    </div>
  );
}
