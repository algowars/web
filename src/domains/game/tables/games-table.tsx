"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
} from "@tanstack/react-table";
import { DataTable } from "@/shared/components/ui/data-table";
import { Button } from "@/shared/components/ui/button";
import { routerConfig } from "@/shared/router-config";
import {
  useUserStore,
  selectIsAuthenticated,
} from "@/domains/user/state/user-store";
import { useOpenGames } from "../api/get-open-games";
import { useJoinGame } from "../api/join-game";
import type { GameLobbySummary } from "../models/game-lobby";
import type { GameModeKey } from "../models/game-mode";

function formatDuration(durationSeconds: number) {
  return `${durationSeconds / 60} min`;
}

function LobbyActionCell({ lobby }: Readonly<{ lobby: GameLobbySummary }>) {
  const router = useRouter();
  const isAuthenticated = useUserStore(selectIsAuthenticated);
  const { mutate: join, isPending: isJoining } = useJoinGame();

  const isFull = lobby.participantCount >= lobby.maxPlayers;
  const openLobby = () =>
    router.push(routerConfig.gamePlay.execute({ gameId: lobby.gameId }));

  // Starting the game now happens inside the lobby (LobbyPanel), not blind
  // from this row — both the host and joined participants just open it.
  if (lobby.isHost || lobby.isParticipant) {
    return (
      <Button size="sm" variant="secondary" onClick={openLobby}>
        Open lobby
      </Button>
    );
  }

  if (isFull) {
    return (
      <Button size="sm" variant="secondary" disabled>
        Full
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      variant="secondary"
      disabled={!isAuthenticated || isJoining}
      title={isAuthenticated ? undefined : "Sign in to join"}
      onClick={() =>
        join(
          { gameId: lobby.gameId },
          {
            onError: (error) =>
              toast.error(error.message || "Failed to join game"),
          }
        )
      }
    >
      {isJoining ? "Joining..." : "Join"}
    </Button>
  );
}

const columns: ColumnDef<GameLobbySummary>[] = [
  {
    accessorKey: "gameModeName",
    header: "Mode",
  },
  {
    accessorKey: "hostUsername",
    header: "Host",
  },
  {
    id: "players",
    header: "Players",
    cell: ({ row }) =>
      `${row.original.participantCount}/${row.original.maxPlayers}`,
  },
  {
    accessorKey: "timeLimitInSeconds",
    header: "Time limit",
    cell: ({ row }) => formatDuration(row.original.timeLimitInSeconds),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
  },
  {
    id: "action",
    header: "",
    cell: ({ row }) => <LobbyActionCell lobby={row.original} />,
  },
];

const PAGE_SIZE = 10;

export default function GamesTable() {
  const searchParams = useSearchParams();
  const gameModeKey = searchParams.get("mode") as GameModeKey | null;
  const [pageIndex, setPageIndex] = useState(0);

  const { data, isLoading } = useOpenGames({
    gameModeKey: gameModeKey ?? undefined,
    page: pageIndex + 1,
    size: PAGE_SIZE,
  });

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next =
      typeof updater === "function"
        ? updater({ pageIndex, pageSize: PAGE_SIZE })
        : updater;
    setPageIndex(next.pageIndex);
  };

  const pageCount = data
    ? (data.totalPages ?? Math.max(1, Math.ceil(data.total / PAGE_SIZE)))
    : -1;

  return (
    <DataTable
      isLoading={isLoading}
      skeletonRows={5}
      data={data?.results ?? []}
      columns={columns}
      paginationProps={{}}
      manualPagination={{
        pagination: { pageIndex, pageSize: PAGE_SIZE },
        onPaginationChange: handlePaginationChange,
        pageCount,
      }}
    />
  );
}
