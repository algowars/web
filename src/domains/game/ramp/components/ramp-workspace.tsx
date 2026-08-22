"use client";

import { EditorWindowTabNode } from "@/domains/workspace/editor-window/state/editor-window-store";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import {
  ArrowLeft,
  CodeXml,
  FileText,
  FlaskConical,
  History,
} from "lucide-react";
import { useMemo } from "react";
import SolutionEditor from "@/domains/workspace/solution-editor/components/solution-editor";
import { ProblemQuestion } from "@/domains/problem/components/problem-question";
import {
  useProblemSetupStore,
  selectCurrentProblem,
} from "@/domains/problem/state/problem-setup-store";
import { EditorWindow } from "@/domains/workspace/editor-window/editor";
import ProblemTestCases from "@/domains/problem/components/problem-test-cases";
import SubmissionStatusPanel from "@/domains/submission/components/submission-status-panel";
import { useSubmissionStatus } from "@/domains/submission/api/get-submission-status";
import { useProblemById } from "@/domains/problem/api/get-problem-by-id";
import { Button } from "@/shared/components/ui/button";
import { useUserStore, selectUser } from "@/domains/user/state/user-store";
import {
  useWorkspaceStore,
  selectWorkspaceCode,
  selectActiveSubmissionId,
  selectIsSubmittingSubmission,
  selectActiveTabByNode,
} from "@/domains/workspace/state/workspace-store";
import {
  useGameSessionStore,
  selectViewingProblemId,
} from "../../state/game-session-store";
import { useGameProblemHistory } from "../../api/get-game-problem-history";
import type { GameWorkspaceProps } from "../../models/game-workspace";
import RampProblemHistory from "./ramp-problem-history";

const EMPTY_SOLVED_PROBLEM_IDS: string[] = [];

/**
 * The "ramp" workspace: solve problems that get harder as you go, matched to
 * DifficultyRampProblemSelectionStrategy on the server. This is the shared
 * per-participant gameplay engine (tabs, mobile layout, code editor, problem
 * history) — every mode's strategy (Solo Rush, Duel, FFA) uses this same
 * component while Running, since the loop is identical per player regardless
 * of how many others are in the game. Reads problem/code/submission state
 * from the zustand stores.
 */
export default function RampWorkspace({
  game,
}: Readonly<GameWorkspaceProps>) {
  const user = useUserStore(selectUser);
  const liveProblem = useProblemSetupStore(selectCurrentProblem);
  const workspaceCode = useWorkspaceStore(selectWorkspaceCode);
  const setCode = useWorkspaceStore((s) => s.setCode);
  const activeSubmissionId = useWorkspaceStore(selectActiveSubmissionId);
  const isSubmittingSubmission = useWorkspaceStore(
    selectIsSubmittingSubmission
  );
  const activeTabByNode = useWorkspaceStore(selectActiveTabByNode);
  const setActiveTab = useWorkspaceStore((s) => s.setActiveTab);
  const isMobile = useIsMobile();

  const viewingProblemId = useGameSessionStore(selectViewingProblemId);
  const viewProblem = useGameSessionStore((s) => s.viewProblem);
  const returnToCurrentProblem = useGameSessionStore(
    (s) => s.returnToCurrentProblem
  );
  const isViewingHistory = viewingProblemId !== null;

  const { data: problemHistories } = useGameProblemHistory({
    gameId: game.gameId,
  });
  const ownHistory = problemHistories?.find((h) => h.userId === user?.id);
  const solvedProblemIds = useMemo(
    () =>
      ownHistory
        ? [...ownHistory.solvedProblemIds].reverse()
        : EMPTY_SOLVED_PROBLEM_IDS,
    [ownHistory]
  );
  const viewingSubmissionId =
    ownHistory?.solvedProblemSubmissions.find(
      (s) => s.problemId === viewingProblemId
    )?.submissionId ?? null;

  const { data: historicalProblem } = useProblemById({
    id: viewingProblemId ?? "",
    queryConfig: { enabled: isViewingHistory },
  });
  const { data: historicalSubmission } =
    useSubmissionStatus(viewingSubmissionId);

  const displayProblem = isViewingHistory
    ? (historicalProblem ?? null)
    : liveProblem;
  const displayCode = isViewingHistory
    ? (historicalSubmission?.code ?? "")
    : workspaceCode;
  const displaySubmissionId = isViewingHistory
    ? viewingSubmissionId
    : activeSubmissionId;

  const tabs = useMemo((): EditorWindowTabNode => {
    const descriptionTab = {
      key: "description",
      name: "Description",
      icon: <FileText size={16} className="text-blue-600 dark:text-blue-400" />,
      component: displayProblem ? (
        <ProblemQuestion problem={displayProblem} />
      ) : (
        <div className="p-4 text-sm text-muted-foreground">
          Loading problem...
        </div>
      ),
    };

    const historyTab = {
      key: "history",
      name: "History",
      icon: (
        <History size={16} className="text-purple-600 dark:text-purple-400" />
      ),
      component: (
        <RampProblemHistory
          solvedProblemIds={solvedProblemIds}
          currentProblemId={liveProblem?.id ?? null}
          viewingProblemId={viewingProblemId}
          onSelectProblem={viewProblem}
          onReturnToCurrent={returnToCurrentProblem}
        />
      ),
    };

    const problemTabs = {
      key: "problem",
      name: "Problem",
      children: [descriptionTab, historyTab],
    };

    const testsTab = {
      key: "tests",
      name: "Tests",
      icon: (
        <FlaskConical
          size={16}
          className="text-indigo-600 dark:text-indigo-400"
        />
      ),
      component: (
        <ProblemTestCases testCases={displayProblem?.publicTestCases ?? []} />
      ),
    };

    const submissionTab = {
      key: "submission",
      name: "Submission",
      icon: (
        <FlaskConical
          size={16}
          className="text-indigo-600 dark:text-indigo-400"
        />
      ),
      component: (
        <SubmissionStatusPanel
          submissionId={displaySubmissionId}
          isSubmitting={!isViewingHistory && isSubmittingSubmission}
        />
      ),
    };

    const executionTabs = {
      key: "execution",
      name: "Execution",
      children: [testsTab, submissionTab],
    };

    const codeTab = {
      key: "code",
      name: "Code",
      icon: (
        <CodeXml size={16} className="text-green-600 dark:text-green-400" />
      ),
      component: isViewingHistory ? (
        <SolutionEditor value={displayCode} editable={false} />
      ) : (
        <SolutionEditor value={displayCode} onChange={setCode} />
      ),
    };

    if (isMobile) {
      return {
        children: [
          codeTab,
          { ...descriptionTab, key: "problem", name: "Problem" },
          testsTab,
          submissionTab,
          historyTab,
        ],
      };
    }

    return {
      orientation: "horizontal",
      children: [
        {
          ...codeTab,
          defaultSize: 50,
        },
        {
          key: "right-column",
          defaultSize: 50,
          orientation: "vertical",
          children: [
            {
              ...problemTabs,
              defaultSize: 55,
            },
            {
              ...executionTabs,
              defaultSize: 45,
            },
          ],
        },
      ],
    };
  }, [
    displayProblem,
    displayCode,
    displaySubmissionId,
    isViewingHistory,
    isMobile,
    setCode,
    isSubmittingSubmission,
    solvedProblemIds,
    liveProblem,
    viewingProblemId,
    viewProblem,
    returnToCurrentProblem,
  ]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      {isViewingHistory ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
          <span>
            Viewing{" "}
            <span className="font-semibold">
              {historicalProblem?.title ?? "a previous problem"}
            </span>{" "}
            — solved, read-only.
          </span>
          <Button
            size="sm"
            variant="secondary"
            className="gap-1.5"
            onClick={returnToCurrentProblem}
          >
            <ArrowLeft size={14} /> Back to current problem
          </Button>
        </div>
      ) : null}

      <div className="min-h-0 flex-1">
        <EditorWindow
          tabs={tabs}
          activeTabByNode={activeTabByNode}
          onTabActivate={setActiveTab}
        />
      </div>
    </div>
  );
}
