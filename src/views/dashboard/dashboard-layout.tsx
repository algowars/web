"use client";

import AvailableGameModesHeader from "@/domains/game/components/available-game-modes-header";
import PlayDuelCard from "@/domains/game/components/play-duel-card";
import PlayFFACard from "@/domains/game/components/play-ffa-card";
import PlaySoloRushCard from "@/domains/game/components/play-solo-rush-card";
import { ProblemEvents } from "@/domains/problem/state/problem-events";
import {
  selectProblemsError,
  selectProblemsPage,
  selectProblemsSize,
  selectProblemsTimestamp,
} from "@/domains/problem/state/problem-slice";
import ProblemTable from "@/domains/problem/tables/problem-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import SidebarLayout from "@/shared/layouts/sidebar-layout/sidebar-layout";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import { useEffect } from "react";
import { toast } from "sonner";
import { useGetAvailableGamesQuery } from "@/domains/game/api/game-api";
import { AvailableGamesActions } from "@/domains/game/state/available-games-actions";

export default function DashboardLayout() {
  const dispatch = useAppDispatch();
  const page = useAppSelector(selectProblemsPage);
  const size = useAppSelector(selectProblemsSize);
  const timestamp = useAppSelector(selectProblemsTimestamp);
  const error = useAppSelector(selectProblemsError);

  useEffect(() => {
    if (typeof timestamp !== "string" || timestamp.trim() === "") {
      return;
    }

    dispatch(
      ProblemEvents.loadProblemsRequested({
        page,
        size,
        timestamp,
      })
    );
  }, [dispatch, page, size, timestamp]);

  useEffect(() => {
    if (error) {
      toast.error("Error loading problems", { description: error });
    }
  }, [error]);

  // Fetch available game modes and populate availableGames slice so cards enable correctly
  const { data: availableGames, error: availableGamesError } = useGetAvailableGamesQuery(undefined);

  useEffect(() => {
    if (availableGames) {
      dispatch(AvailableGamesActions.loadAvailableGamesSuccess(availableGames));
    }

    if (availableGamesError) {
      const message = availableGamesError instanceof Error ? availableGamesError.message : "Failed to load available games";
      dispatch(AvailableGamesActions.loadAvailableGamesFailure({ message }));
    }
  }, [availableGames, availableGamesError, dispatch]);

  return (
    <SidebarLayout breadcrumbs={[]}>
      <div className="@container px-2 md:px-4 pb-2 md:pb-4 grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <AvailableGameModesHeader />
        </div>
        <PlaySoloRushCard className="col-span-12 @3xl:col-span-4" />
        <PlayDuelCard className="col-span-12 @2xl:col-span-6 @3xl:col-span-4" />
        <PlayFFACard className="col-span-12 @2xl:col-span-6 @3xl:col-span-4" />
        <Card className="col-span-12">
          <CardHeader>
            <CardTitle>Problems</CardTitle>
          </CardHeader>
          <CardContent>
            <ProblemTable />
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
