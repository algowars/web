"use client";

import ProblemLoading from "@/app/problems/[slug]/loading";
import { ProblemQuestion } from "@/domains/problem/components/problem-question";
import ProblemTestCases from "@/domains/problem/components/problem-test-cases";
import type { Problem } from "@/domains/problem/models/problem";
import { ProblemEvents } from "@/domains/problem/state/problem-events";
import { useGetGameByIdQuery } from "@/domains/game/api/game-api";
import {
  submissionApi,
  type SubmissionStatus,
} from "@/domains/submission/api/submission-api";
import SubmissionStatusPanel from "@/domains/submission/components/submission-status-panel";
import SoloRushWorkspace from "@/domains/game/components/solo-rush-workspace";
import { SoloRushWorkspaceHeader } from "@/domains/game/components/solo-rush-workspace-header";
import type { GameDto } from "@/domains/game/api/game-api";
import type { EditorWindowTabNode } from "@/domains/workspace/editor-window/state/editor-window-store";
import { selectActiveSubmissionId } from "@/domains/workspace/state/workspace-slice";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import SidebarLayout from "@/shared/layouts/sidebar-layout/sidebar-layout";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import { CodeXml, FileText, FlaskConical } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
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

  useEffect(() => {
    if (!activeSubmissionId || !cachedSubmissionStatus) return;
    if (!terminalSubmissionStatuses.has(cachedSubmissionStatus.status)) return;
    if (refetchedForSubmissionIdRef.current === activeSubmissionId) return;

    refetchedForSubmissionIdRef.current = activeSubmissionId;
    void refetchGame();
  }, [activeSubmissionId, cachedSubmissionStatus, refetchGame]);

  const problem: Problem | null = useMemo(() => {
    if (!currentGameProblem?.slug || !currentGameProblem.title) return null;

    return {
      id: currentGameProblem.problemId,
      slug: currentGameProblem.slug,
      title: currentGameProblem.title,
      difficultyTier: currentGameProblem.difficultyTier,
      question: currentGameProblem.question ?? "",
      availableLanguages: currentGameProblem.availableLanguages,
      publicTestCases: currentGameProblem.publicTestCases,
    };
  }, [currentGameProblem]);

  const currentProblemKey = currentGameProblem
    ? `${currentGameProblem.problemId}:${currentGameProblem.order}`
    : null;

  useEffect(() => {
    if (!problem || !currentProblemKey) return;
    if (initializedProblemKeyRef.current === currentProblemKey) return;

    dispatch(ProblemEvents.initializeProblem(problem));
    initializedProblemKeyRef.current = currentProblemKey;
  }, [currentProblemKey, dispatch, problem]);

  const player = currentGame.players[0];
  const problemsSolved = player?.currentRuleStepOrder ?? 0;
  const endTimeMs =
    new Date(currentGame.startedAt).getTime() + currentGame.timeLimitSeconds * 1000;

  const tabs = useMemo((): EditorWindowTabNode | null => {
    if (!problem) return null;

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
            component: <ProblemSolutionEditor />,
          },
          mobileProblemTab,
          mobileTestsTab,
          mobileSubmissionTab,
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
          component: <ProblemSolutionEditor />,
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
  }, [isMobile, problem]);

  if (isMobile === undefined || !tabs) return <ProblemLoading />;

  return (
    <SidebarLayout
      breadcrumbs={[]}
      headerItems={
        <SoloRushWorkspaceHeader
          endTimeMs={endTimeMs}
          problemsSolved={problemsSolved}
          availableLanguages={problem?.availableLanguages ?? []}
        />
      }
    >
      <div className="h-full px-2 md:px-4 pb-2 md:pb-4">
        <SoloRushWorkspace tab={tabs} />
      </div>
    </SidebarLayout>
  );
}
