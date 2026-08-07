"use client";

import AvailableGameModesHeader from "@/domains/game/components/available-game-modes-header";
import PlayDuelCard from "@/domains/game/components/play-duel-card";
import PlayFFACard from "@/domains/game/components/play-ffa-card";
import PlaySoloRushCard from "@/domains/game/components/play-solo-rush-card";
import { useLoadProblems } from "@/domains/problem/hooks/use-load-problems";
import ProblemTable from "@/domains/problem/tables/problem-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import SidebarLayout from "@/shared/layouts/sidebar-layout/sidebar-layout";

export default function DashboardLayout() {
  useLoadProblems();

  // Game mode availability is read directly from the `getAvailableGames`
  // RTK Query cache by each play-*-card component (via useAvailableGameMode)
  // — no need to fetch or sync it here.

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
