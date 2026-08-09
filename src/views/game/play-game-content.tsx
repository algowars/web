"use client";

import { EditorWindowTabNode } from "@/domains/workspace/editor-window/state/editor-window-store";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import SidebarLayout from "@/shared/layouts/sidebar-layout/sidebar-layout";
import { CodeXml, FileText } from "lucide-react";
import { useMemo, useEffect } from "react";
import ProblemSolutionEditor from "../problems/problem/problem-solution-editor";
import PlayGameWorkspace from "@/domains/game/components/play-game-workspace";
import { GameActions } from "@/domains/game/state/game-actions";
import {
  selectCurrentGame,
  selectGameCountdownSeconds,
  selectGameError,
  selectIsLoadingGame,
} from "@/domains/game/state/game-slice";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";

type PlayGameContentProps = {
  gameId: string;
};

export default function PlayGameContent({
  gameId,
}: Readonly<PlayGameContentProps>) {
  const dispatch = useAppDispatch();
  const currentGame = useAppSelector(selectCurrentGame);
  const countdownSeconds = useAppSelector(selectGameCountdownSeconds);
  const isLoading = useAppSelector(selectIsLoadingGame);
  const error = useAppSelector(selectGameError);

  useEffect(() => {
    dispatch(GameActions.loadGameRequested(gameId));
  }, [dispatch, gameId]);

  const isMobile = useIsMobile();

  const tabs = useMemo((): EditorWindowTabNode => {
    const problemTabs = {
      key: "problem",
      name: "Problem",
      children: [
        {
          key: "description",
          name: "Description",
          icon: (
            <FileText size={16} className="text-blue-600 dark:text-blue-400" />
          ),
          component: <div></div>,
        },
      ],
    };

    const mobileProblemTab = {
      key: "problem",
      name: "Problem",
      icon: <FileText size={16} className="text-blue-600 dark:text-blue-400" />,
      component: <div></div>,
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
            component: <div></div>,
          },
          mobileProblemTab,
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
            {
              ...problemTabs,
              defaultSize: 55,
            },
          ],
        },
      ],
    };
  }, [isMobile]);

  return (
    <SidebarLayout breadcrumbs={[]}>
      <div className="h-full px-2 md:px-4 pb-2 md:pb-4">
        {isLoading && <div>Loading game...</div>}
        {error && <div>{error}</div>}
        {countdownSeconds !== null && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p>Game is starting</p>
              <p className="text-5xl font-bold">{countdownSeconds}</p>
            </div>
          </div>
        )}
        {currentGame && countdownSeconds === null && !error && (
          <PlayGameWorkspace tab={tabs} />
        )}
      </div>
    </SidebarLayout>
  );
}
