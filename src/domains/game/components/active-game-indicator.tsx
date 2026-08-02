"use client";

import { useAppSelector } from "@/shared/state/hooks";
import { selectIsAuthenticated } from "@/domains/user/state/user-slice";
import { useGetMyActiveGameQuery, useGetMyActiveLobbyQuery } from "../api/game-api";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Swords } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

const POLL_INTERVAL_MS = 15_000;

/**
 * Persistent, app-wide banner shown whenever the current user has a game in progress or is
 * waiting in a lobby for one to start — so they're never "stranded" on another page unaware
 * that a match is still running. Mounted once in AppProviders so it renders above every route.
 */
export default function ActiveGameIndicator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const pathname = usePathname();

  const { data: activeGame } = useGetMyActiveGameQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: POLL_INTERVAL_MS,
  });
  const { data: activeLobby } = useGetMyActiveLobbyQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: POLL_INTERVAL_MS,
  });

  if (!isAuthenticated) return null;

  if (activeGame && activeGame.status === "Active") {
    const gameHref = `/game/${encodeURIComponent(activeGame.id)}`;
    if (pathname === gameHref) return null;

    return (
      <Link
        href={gameHref}
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 bg-lime-500/15 px-4 py-1.5 text-sm font-medium text-lime-600 backdrop-blur transition-colors hover:bg-lime-500/25 dark:text-lime-400"
      >
        <Swords className="size-4" />
        Game in progress — return to your match
        <Badge variant="outline" className="border-lime-500/40">
          Resume
        </Badge>
      </Link>
    );
  }

  if (activeLobby && (activeLobby.status === "Open" || activeLobby.status === "Ready")) {
    return (
      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 bg-sky-500/15 px-4 py-1.5 text-sm font-medium text-sky-600 dark:text-sky-400">
        <Swords className="size-4" />
        Waiting for your lobby to start…
      </div>
    );
  }

  return null;
}
