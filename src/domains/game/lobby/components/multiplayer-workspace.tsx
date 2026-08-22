"use client";

import { GameStatus } from "../../models/game";
import type { GameWorkspaceProps } from "../../models/game-workspace";
import RampWorkspace from "../../ramp/components/ramp-workspace";
import LobbyWorkspace from "./lobby-workspace";

/**
 * Workspace strategy for multiplayer modes (Duel, FFA): the lobby while
 * Pending, then the same ramp gameplay every mode uses once Running. This is
 * just a phase switch — the two states it composes (LobbyWorkspace,
 * RampWorkspace) own their own behavior; add nothing multiplayer-specific
 * here.
 */
export default function MultiplayerWorkspace({
  game,
}: Readonly<GameWorkspaceProps>) {
  if (game.status === GameStatus.Pending) {
    return <LobbyWorkspace game={game} />;
  }

  return <RampWorkspace game={game} />;
}
