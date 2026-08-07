"use client";

import ProblemLoading from "@/app/problems/[slug]/loading";
import { ProblemQuestion } from "@/domains/problem/components/problem-question";
import ProblemTestCases from "@/domains/problem/components/problem-test-cases";
import type { Problem } from "@/domains/problem/models/problem";
import { ProblemEvents } from "@/domains/problem/state/problem-events";
import { useGetGameByIdQuery } from "@/domains/game/api/game-api";
import type { GameProblemDto } from "@/domains/game/api/game-api";
import {
  submissionApi,
  type SubmissionStatus,
} from "@/domains/submission/api/submission-api";
import SubmissionStatusPanel from "@/domains/submission/components/submission-status-panel";
import SoloRushWorkspace from "@/domains/game/components/solo-rush-workspace";
import { SoloRushWorkspaceHeader } from "@/domains/game/components/solo-rush-workspace-header";
import SoloRushHistoryList, {
  SoloRushHistoryTabIcon,
} from "@/domains/game/components/solo-rush-history-list";
import SoloRushHistoryCodeView from "@/domains/game/components/solo-rush-history-code-view";
import SoloRushGameOverDialog from "@/domains/game/components/solo-rush-game-over-dialog";
import { useCountdownSeconds } from "@/domains/game/hooks/use-countdown-seconds";
import type { GameDto } from "@/domains/game/api/game-api";
import type { EditorWindowTabNode } from "@/domains/workspace/editor-window/state/editor-window-store";
import { selectActiveSubmissionId } from "@/domains/workspace/state/workspace-slice";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import SidebarLayout from "@/shared/layouts/sidebar-layout/sidebar-layout";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import { CodeXml, FileText, FlaskConical } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ProblemSolutionEditor from "@/views/problems/problem/problem-solution-editor";

type GameLayoutProps = {
  game: GameDto;
};

const terminalSubmissionStatuses = new Set<SubmissionStatus>([
  "Accepted",
  "WrongAnswer",
]);

/**
 * Picks the problem currently in play: the one with the highest `order`.
 * Solo Rush only ever assigns the next problem once the previous one is
 * solved, so the last entry in `game.problems` is always the active one.
 */
function useCurrentGameProblem(game: GameDto) {
  return useMemo(
    () => [...game.problems].sort((a, b) => b.order - a.order)[0],
    [game.problems]
  );
}

function toProblem(gameProblem: GameProblemDto | undefined): Problem | null {
  if (!gameProblem?.slug || !gameProblem.title) return null;

  return {
    id: gameProblem.problemId,
    slug: gameProblem.slug,
    title: gameProblem.title,
    difficultyTier: gameProblem.difficultyTier,
    question: gameProblem.question ?? "",
    availableLanguages: gameProblem.availableLanguages,
    publicTestCases: gameProblem.publicTestCases,
  };
}

export default function GameLayout({ game }: Readonly<GameLayoutProps>) {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const initializedProblemKeyRef = useRef<string | null>(null);
  const refetchedForSubmissionIdRef = useRef<string | null>(null);
  const activeSubmissionId = useAppSelector(selectActiveSubmissionId);
  const selectCachedSubmissionStatus = useMemo(
    () =>
      submissionApi.endpoints.getSubmissionStatus.select(activeSubmissionId ?? ""),
    [activeSubmissionId]
  );
  const cachedSubmissionStatus = useAppSelector((state) =>
    activeSubmissionId ? selectCachedSubmissionStatus(state).data : undefined
  );

  const { data: liveGame, refetch: refetchGame } = useGetGameByIdQuery(game.id, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });
  const currentGame = liveGame ?? game;
  const currentGameProblem = useCurrentGameProblem(currentGame);
  const sortedProblems = useMemo(
    () => [...currentGame.problems].sort((a, b) => a.order - b.order),
    [currentGame.problems]
  );

  // `null` means "showing the live, in-progress problem". Any other value is
  // the `order` of a previously solved problem the player is looking back at.
  const [viewedOrder, setViewedOrder] = useState<number | null>(null);

  useEffect(() => {
    if (!activeSubmissionId || !cachedSubmissionStatus) return;
    if (!terminalSubmissionStatuses.has(cachedSubmissionStatus.status)) return;
    if (refetchedForSubmissionIdRef.current === activeSubmissionId) return;

    refetchedForSubmissionIdRef.current = activeSubmissionId;
    void refetchGame();
  }, [activeSubmissionId, cachedSubmissionStatus, refetchGame]);

  // The problem actually in play — the only one whose code/language lives in
  // the live `workspace`/`problemSetup` Redux slices.
  const liveProblem = useMemo(
    () => toProblem(currentGameProblem),
    [currentGameProblem]
  );

  const currentProblemKey = currentGameProblem
    ? `${currentGameProblem.problemId}:${currentGameProblem.order}`
    : null;

  useEffect(() => {
    if (!liveProblem || !currentProblemKey) return;
    if (initializedProblemKeyRef.current === currentProblemKey) return;

    dispatch(ProblemEvents.initializeProblem(liveProblem));
    initializedProblemKeyRef.current = currentProblemKey;
    // A new problem was just assigned — drop back to viewing it live instead
    // of leaving the player stranded on a stale history view.
    setViewedOrder(null);
  }, [currentProblemKey, dispatch, liveProblem]);

  const isViewingHistory =
    viewedOrder !== null && viewedOrder !== currentGameProblem?.order;

  const viewedGameProblem = isViewingHistory
    ? sortedProblems.find((p) => p.order === viewedOrder) ?? currentGameProblem
    : currentGameProblem;

  // What Description/Tests render — the problem currently being *viewed*,
  // which may be a past, already-solved step rather than the live one.
  const problem = useMemo(
    () => toProblem(viewedGameProblem),
    [viewedGameProblem]
  );

  const player = currentGame.players[0];
  const problemsSolved = player?.currentRuleStepOrder ?? 0;
  const endTimeMs =
    new Date(currentGame.startedAt).getTime() + currentGame.timeLimitSeconds * 1000;

  const remainingSeconds = useCountdownSeconds(endTimeMs);
  // The client clock is the most responsive way to notice time running out
  // (no need to wait for the next poll of `getGameById`), but also fall back
  // to the server's own status in case the player reloads a game page after
  // it already ended (time-up, forfeited, etc.) on a previous visit.
  const isGameOver =
    (remainingSeconds !== null && remainingSeconds <= 0) ||
    currentGame.status !== "Active";

  const tabs = useMemo((): EditorWindowTabNode | null => {
    if (!problem) return null;

    const codeComponent =
      isViewingHistory && viewedGameProblem ? (
        <SoloRushHistoryCodeView
          gameId={currentGame.id}
          problemId={viewedGameProblem.problemId}
        />
      ) : (
        <ProblemSolutionEditor />
      );

    const historyTab: EditorWindowTabNode | null =
      sortedProblems.length > 1
        ? {
            key: "history",
            name: "History",
            icon: SoloRushHistoryTabIcon,
            component: (
              <SoloRushHistoryList
                problems={sortedProblems}
                currentOrder={currentGameProblem?.order ?? 0}
                viewedOrder={viewedOrder ?? currentGameProblem?.order ?? 0}
                onSelect={(order) =>
                  setViewedOrder(
                    order === currentGameProblem?.order ? null : order
                  )
                }
              />
            ),
          }
        : null;

    const problemTabs: EditorWindowTabNode = {
      key: "problem",
      name: "Problem",
      children: [
        {
          key: "description",
          name: "Description",
          icon: (
            <FileText size={16} className="text-blue-600 dark:text-blue-400" />
          ),
          component: <ProblemQuestion problem={problem} />,
        },
        ...(historyTab ? [historyTab] : []),
      ],
    };

    const mobileProblemTab: EditorWindowTabNode = {
      key: "problem",
      name: "Problem",
      icon: <FileText size={16} className="text-blue-600 dark:text-blue-400" />,
      component: <ProblemQuestion problem={problem} />,
    };

    const executionTabs: EditorWindowTabNode = {
      key: "execution",
      name: "Execution",
      children: [
        {
          key: "tests",
          name: "Tests",
          icon: (
            <FlaskConical
              size={16}
              className="text-indigo-600 dark:text-indigo-400"
            />
          ),
          component: (
            <ProblemTestCases testCases={problem.publicTestCases} />
          ),
        },
        {
          key: "submission",
          name: "Submission",
          icon: (
            <FlaskConical
              size={16}
              className="text-indigo-600 dark:text-indigo-400"
            />
          ),
          component: <SubmissionStatusPanel />,
        },
      ],
    };

    const mobileTestsTab: EditorWindowTabNode = {
      key: "tests",
      name: "Tests",
      icon: (
        <FlaskConical
          size={16}
          className="text-indigo-600 dark:text-indigo-400"
        />
      ),
      component: <ProblemTestCases testCases={problem.publicTestCases} />,
    };

    const mobileSubmissionTab: EditorWindowTabNode = {
      key: "submission",
      name: "Submission",
      icon: (
        <FlaskConical
          size={16}
          className="text-indigo-600 dark:text-indigo-400"
        />
      ),
      component: <SubmissionStatusPanel />,
    };

    if (isMobile) {
      return {
        children: [
          {
            key: "code",
            name: "Code",
            icon: (
              <CodeXml
                size={16}
                className="text-green-600 dark:text-green-400"
              />
            ),
            component: codeComponent,
          },
          mobileProblemTab,
          mobileTestsTab,
          mobileSubmissionTab,
          ...(historyTab ? [historyTab] : []),
        ],
      };
    }

    return {
      orientation: "horizontal",
      children: [
        {
          key: "code",
          name: "Code",
          defaultSize: 50,
          icon: (
            <CodeXml size={16} className="text-green-600 dark:text-green-400" />
          ),
          component: codeComponent,
        },
        {
          key: "right-column",
          defaultSize: 50,
          orientation: "vertical",
          children: [
            { ...problemTabs, defaultSize: 55 },
            { ...executionTabs, defaultSize: 45 },
          ],
        },
      ],
    };
  }, [
    currentGame.id,
    currentGameProblem?.order,
    isMobile,
    isViewingHistory,
    problem,
    sortedProblems,
    viewedGameProblem,
    viewedOrder,
  ]);

  if (isMobile === undefined || !tabs) return <ProblemLoading />;

  return (
    <>
      <SidebarLayout
        breadcrumbs={[]}
        headerItems={
          <SoloRushWorkspaceHeader
            gameId={currentGame.id}
            endTimeMs={endTimeMs}
            problemsSolved={problemsSolved}
            availableLanguages={liveProblem?.availableLanguages ?? []}
            isViewingHistory={isViewingHistory}
          />
        }
      >
        <div className="h-full px-2 md:px-4 pb-2 md:pb-4">
          <SoloRushWorkspace tab={tabs} />
        </div>
      </SidebarLayout>
      <SoloRushGameOverDialog game={currentGame} open={isGameOver} />
    </>
  );
}
