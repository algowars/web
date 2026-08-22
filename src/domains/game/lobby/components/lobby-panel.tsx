"use client";

import { toast } from "sonner";
import { Users, Crown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { useUserStore, selectUser } from "@/domains/user/state/user-store";
import { useGameModes } from "../../api/use-game-modes";
import { useStartGame } from "../../api/start-game";
import type { GameWorkspaceProps } from "../../models/game-workspace";

/**
 * The lobby-phase side panel for multiplayer modes (Duel, FFA). Shown next to
 * the empty editor while a game is Pending — before any problem exists.
 * Renders as the "game owner panel" for whoever created the lobby (seat 1,
 * matching Game's constructor on the server), and as a waiting view for
 * everyone else who has joined.
 */
export default function LobbyPanel({ game }: Readonly<GameWorkspaceProps>) {
  const user = useUserStore(selectUser);
  const { data: gameModes } = useGameModes();
  const { mutate: start, isPending: isStarting } = useStartGame();

  const gameMode = gameModes?.find((mode) => mode.id === game.gameModeId);
  const minPlayers = gameMode?.minPlayers ?? 1;
  const maxPlayers = gameMode?.maxPlayers ?? game.participants.length;

  const participants = [...game.participants].sort(
    (a, b) => a.seatNumber - b.seatNumber
  );
  const isHost = participants[0]?.userId === user?.id;
  const canStart = participants.length >= minPlayers;

  const handleStart = () => {
    start(
      { gameId: game.gameId },
      {
        onError: (error) =>
          toast.error(error.message || "Failed to start game"),
      }
    );
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Lobby</h3>
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users size={14} />
          {participants.length}/{maxPlayers}
        </span>
      </div>

      <ul className="flex flex-col gap-2">
        {participants.map((participant) => (
          <li
            key={participant.userId}
            className="flex items-center gap-2 rounded-md border bg-muted/30 px-2 py-1.5"
          >
            <Avatar size="sm">
              <AvatarImage
                src={participant.imageUrl}
                alt={participant.username}
              />
              <AvatarFallback>
                {participant.username?.[0]?.toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>
            <span className="flex-1 truncate text-sm font-medium">
              {participant.username}
              {participant.userId === user?.id ? " (You)" : ""}
            </span>
            {participant.seatNumber === 1 ? (
              <span
                title="Host"
                className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400"
              >
                <Crown size={12} /> Host
              </span>
            ) : null}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-2 border-t pt-3">
        {isHost ? (
          <>
            <Button disabled={!canStart || isStarting} onClick={handleStart}>
              {isStarting ? "Starting..." : "Start game"}
            </Button>
            {!canStart ? (
              <p className="text-center text-xs text-muted-foreground">
                Waiting for at least {minPlayers} player
                {minPlayers === 1 ? "" : "s"} to join...
              </p>
            ) : null}
          </>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Waiting for the host to start the game...
          </p>
        )}
      </div>
    </div>
  );
}
