"use client";

import { useRouter, useSearchParams } from "next/navigation";
import SidebarLayout from "@/shared/layouts/sidebar-layout/sidebar-layout";
import GamesTable from "@/domains/game/tables/games-table";
import CreateGameDialog from "@/domains/game/components/create-game-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { routerConfig } from "@/shared/router-config";
import { GameModeKey } from "@/domains/game/models/game-mode";
import { Card } from "@/shared/components/ui/card";

const ALL_MODES = "all";

export default function GamesLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") ?? ALL_MODES;

  const onModeChange = (value: string) => {
    router.push(
      routerConfig.games.execute({
        mode: value === ALL_MODES ? undefined : value,
      })
    );
  };

  return (
    <SidebarLayout breadcrumbs={[]}>
      <div className="@container flex flex-col gap-4 px-2 pb-2 md:px-4 md:pb-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Games</h3>
          <p className="text-muted-foreground">
            Join an open lobby or create your own.
          </p>
        </div>

        <Card className="px-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Select value={mode} onValueChange={onModeChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All modes" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value={ALL_MODES}>All modes</SelectItem>
                <SelectItem value={GameModeKey.Duel}>Duel</SelectItem>
                <SelectItem value={GameModeKey.Ffa}>FFA</SelectItem>
              </SelectContent>
            </Select>

            <CreateGameDialog
              defaultModeKey={mode === ALL_MODES ? undefined : mode}
            />
          </div>

          <GamesTable />
        </Card>
      </div>
    </SidebarLayout>
  );
}
