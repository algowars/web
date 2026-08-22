"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Hourglass, Swords } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { routerConfig } from "@/shared/router-config";
import {
  useUserStore,
  selectIsAuthenticated,
} from "@/domains/user/state/user-store";
import { useMyActiveGames } from "../api/get-my-active-games";
import { GameStatus } from "../models/game";
import type { MyActiveGame } from "../models/my-active-game";
import LeaveLobbyButton from "./leave-lobby-button";

// A fixed, known height (rather than letting py-2 + content decide it) so the CSS variable
// below can offset the sidebar by exactly this much — see the effect at the bottom of this
// file and its matching use in shared/components/ui/sidebar.tsx.
const BANNER_HEIGHT = "2.5rem"; // h-10

// Fixed dark-on-white contrast regardless of the app's own light/dark theme — this is meant
// to grab attention as a distinct system banner, not blend in as page chrome.
const bannerClassName =
  "sticky top-0 z-50 flex h-10 items-center gap-3 overflow-hidden bg-neutral-900 px-4 text-sm text-white";
const ctaClassName = "bg-white text-neutral-900 hover:bg-white/90";

function SingleGameBanner({ game }: Readonly<{ game: MyActiveGame }>) {
  const router = useRouter();
  const isPending = game.status === GameStatus.Pending;

  const goToGame = () =>
    router.push(routerConfig.gamePlay.execute({ gameId: game.gameId }));

  return (
    <div className={bannerClassName}>
      {isPending ? (
        <Hourglass size={16} className="shrink-0 text-white/70" />
      ) : (
        <Swords size={16} className="shrink-0 text-white/70" />
      )}
      <span className="truncate font-medium">
        {isPending
          ? `Waiting in a ${game.gameModeName} lobby (${game.participantCount}/${game.maxPlayers})`
          : `${game.gameModeName} game in progress`}
      </span>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        {isPending ? (
          <LeaveLobbyButton
            gameId={game.gameId}
            className="text-white hover:bg-white/10 hover:text-white"
          />
        ) : null}

        <Button size="sm" onClick={goToGame} className={ctaClassName}>
          {isPending ? "Go to lobby" : "Go to game"}
          <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
}

function MultipleGamesBanner({ count }: Readonly<{ count: number }>) {
  const router = useRouter();

  return (
    <div className={bannerClassName}>
      <Swords size={16} className="shrink-0 text-white/70" />
      <span className="truncate font-medium">
        You have {count} active games
      </span>
      <div className="ml-auto shrink-0">
        <Button
          size="sm"
          onClick={() => router.push(routerConfig.games.execute())}
          className={ctaClassName}
        >
          View my games
          <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
}

/**
 * Global "you're in a game" indicator, rendered in AppProviders — outside every page's own
 * SidebarLayout, so it sits at the very top of the page (full width, above the sidebar chrome)
 * rather than inside any one page's content column, and follows the player everywhere:
 * browsing problems, the dashboard, wherever, while waiting for a Duel/FFA lobby to fill
 * without losing track of it.
 *
 * Shows at most one banner row. With exactly one active game it's specific (mode, player
 * count, Leave/Go-to actions); with more than one it collapses to a single generic "N active
 * games" banner that sends you to /games (where MyActiveGamesTable lists all of them) rather
 * than guessing which one you meant.
 *
 * Polls /game/mine (useMyActiveGames) and, since that's the only signal available for it,
 * detects a Pending -> Running transition itself by diffing against the previously seen status
 * per game, firing a toast with a "Go to game" action the moment it notices. Hidden on the page
 * the banner would otherwise link to (a specific game's own page, or /games for the collapsed
 * case) and entirely for anonymous visitors (the endpoint requires auth).
 *
 * Sets --active-banner-offset on <html> whenever it's actually rendered, at a fixed height
 * matching BANNER_HEIGHT. The sidebar is `position: fixed`, anchored to the true viewport top
 * independent of this banner's place in the document flow, so without that variable it would
 * render underneath (behind) the banner — see shared/components/ui/sidebar.tsx.
 */
export default function ActiveGameBanner() {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useUserStore(selectIsAuthenticated);
  const { data: games } = useMyActiveGames(isAuthenticated);
  const previousStatusByGameId = useRef<Map<string, GameStatus>>(new Map());

  useEffect(() => {
    if (!games) return;

    for (const game of games) {
      const previousStatus = previousStatusByGameId.current.get(game.gameId);
      if (
        previousStatus === GameStatus.Pending &&
        game.status === GameStatus.Running
      ) {
        toast.success(`Your ${game.gameModeName} game has started!`, {
          duration: 10_000,
          action: {
            label: "Go to game",
            onClick: () =>
              router.push(
                routerConfig.gamePlay.execute({ gameId: game.gameId })
              ),
          },
        });
      }
    }

    previousStatusByGameId.current = new Map(
      games.map((game) => [game.gameId, game.status])
    );
  }, [games, router]);

  const hasGames = !!games && games.length > 0;
  const isCollapsed = hasGames && games.length > 1;
  const onlyGame = hasGames && games.length === 1 ? games[0] : null;

  const isHiddenOnThisRoute = isCollapsed
    ? pathname === routerConfig.games.execute()
    : onlyGame
      ? pathname === routerConfig.gamePlay.execute({ gameId: onlyGame.gameId })
      : false;

  const isVisible = hasGames && !isHiddenOnThisRoute;

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--active-banner-offset",
      isVisible ? BANNER_HEIGHT : "0px"
    );
    return () => {
      document.documentElement.style.setProperty("--active-banner-offset", "0px");
    };
  }, [isVisible]);

  if (!isVisible) return null;

  if (isCollapsed) {
    return <MultipleGamesBanner count={games.length} />;
  }

  return <SingleGameBanner game={onlyGame!} />;
}
