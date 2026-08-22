"use client";

import { GameStatus } from "../../models/game";
import type { GameWorkspaceProps } from "../../models/game-workspace";
import RampWorkspaceHeader from "../../ramp/components/ramp-workspace-header";

/**
 * Header strategy for multiplayer modes. PlayGameContent renders the
 * registered Header whenever the game isn't over, but the ramp toolbar
 * (timer, submit, forfeit) only makes sense once there's a problem to work
 * on — LobbyWorkspace's own LobbyPanel already covers the Pending phase, so
 * this renders nothing until Running, then defers to the shared header.
 */
export default function MultiplayerWorkspaceHeader({
  game,
}: Readonly<GameWorkspaceProps>) {
  if (game.status !== GameStatus.Running) {
    return null;
  }

  return <RampWorkspaceHeader game={game} />;
}
