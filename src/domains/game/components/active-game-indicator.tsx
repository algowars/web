"use client";

import { useAppSelector } from "@/shared/state/hooks";
import { selectIsAuthenticated } from "@/domains/user/state/user-slice";
import {
  type GameDto,
  useGetMyActiveGameQuery,
  useGetMyActiveLobbyQuery,
  useLeaveLobbyMutation,
} from "../api/game-api";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2, Swords, X } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";

const POLL_INTERVAL_MS = 15_000;

function isExpiredActiveGame(game: GameDto): boolean {
  if (game.status !== "Active") return true;

  const startedAt = Date.parse(game.startedAt);
  if (Number.isNaN(startedAt)) return false;

  return Date.now() >= startedAt + game.timeLimitSeconds * 1_000;
}

export default function ActiveGameIndicator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const pathname = usePathname();
  const [leaveLobby, { isLoading: isCancelling }] = useLeaveLobbyMutation();

  const { currentData: activeGame } = useGetMyActiveGameQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: POLL_INTERVAL_MS,
  });
  const { currentData: activeLobby } = useGetMyActiveLobbyQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: POLL_INTERVAL_MS,
  });

  if (!isAuthenticated) return null;
  if (pathname === "/game" || pathname?.startsWith("/game/")) return null;

  if (
    activeGame &&
    activeGame.status === "Active" &&
    !isExpiredActiveGame(activeGame)
  ) {
    const gameHref = `/game/${encodeURIComponent(activeGame.id)}`;
    if (pathname === gameHref) return null;

    return (
      <Link
        href={gameHref}
        className="inline-flex items-center gap-2 rounded-md border border-lime-500/30 bg-lime-500/15 px-2.5 py-1 text-xs font-medium text-lime-700 transition-colors hover:bg-lime-500/25 dark:text-lime-300"
      >
        <Swords className="size-4" />
        <span className="hidden sm:inline">Game in progress</span>
        <Badge variant="outline" className="border-lime-500/40">
          Resume
        </Badge>
      </Link>
    );
  }

  if (
    activeLobby &&
    (activeLobby.status === "Open" || activeLobby.status === "Ready")
  ) {
    const isSearching = activeLobby.status === "Open";
    const statusText = isSearching
      ? `Searching for opponents… (${activeLobby.members.length}/${activeLobby.capacity} joined)`
      : "Lobby full — game starting soon…";

    const handleCancel = async () => {
      try {
        await leaveLobby(activeLobby.id).unwrap();
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to cancel";
        toast.error(message);
      }
    };

    return (
      <div className="inline-flex items-center gap-2 rounded-md border border-sky-500/30 bg-sky-500/15 px-2.5 py-1 text-xs font-medium text-sky-700 dark:text-sky-300">
        <Loader2 className="size-4 animate-spin" />
        <span className="hidden sm:inline">{statusText}</span>
        <span className="sm:hidden">Lobby active</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 gap-1 px-2 text-sky-700 hover:bg-sky-500/20 hover:text-sky-800 dark:text-sky-300"
          disabled={isCancelling}
          onClick={handleCancel}
        >
          <X className="size-3.5" />
          {isCancelling ? "Cancelling…" : "Cancel"}
        </Button>
      </div>
    );
  }

  return null;
}
