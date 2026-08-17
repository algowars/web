"use client";

import AvailableGameModesHeader from "@/domains/game/components/available-game-modes-header";
import PlayDuelCard from "@/domains/game/components/play-duel-card";
import PlayFFACard from "@/domains/game/components/play-ffa-card";
import dynamic from "next/dynamic";

const PlaySoloRushCard = dynamic(
  () => import("@/domains/game/components/play-solo-rush-card"),
  { ssr: false }
);
import { useAvailableGameModes } from "@/domains/game/hooks/use-available-game-modes";
import { useLoadProblems } from "@/domains/problem/hooks/use-load-problems";
import ProblemTable from "@/domains/problem/tables/problem-table";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/shared/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import SidebarLayout from "@/shared/layouts/sidebar-layout/sidebar-layout";
import { AlertTriangle } from "lucide-react";

export default function DashboardLayout() {
  useLoadProblems();
  const { error: gameModesError } = useAvailableGameModes();

  return (
    <SidebarLayout breadcrumbs={[]}>
      <div className="@container px-2 md:px-4 pb-2 md:pb-4 grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <AvailableGameModesHeader />
          {gameModesError ? (
            <Alert variant="destructive" className="mt-2">
              <AlertTriangle />
              <AlertTitle>Unable to load game modes</AlertTitle>
              <AlertDescription>{gameModesError}</AlertDescription>
            </Alert>
          ) : null}
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
