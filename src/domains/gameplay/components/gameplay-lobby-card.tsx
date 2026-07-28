"use client";

import {
  useJoinLobbyMutation,
  useSetLobbyReadyMutation,
} from "@/domains/gameplay/api/gameplay-api";
import { GameplayEvents } from "@/domains/gameplay/state/gameplay-slice";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useAppDispatch } from "@/shared/state/hooks";
import { useUser } from "@auth0/nextjs-auth0";
import { CheckCircle2, Users } from "lucide-react";
import type { LobbyDto } from "../models/gameplay";

type GameplayLobbyCardProps = {
  lobby: LobbyDto;
  modeName: string;
  canStart: boolean;
  onStartGame: () => void;
};

export default function GameplayLobbyCard({
  lobby,
  modeName,
  canStart,
  onStartGame,
}: Readonly<GameplayLobbyCardProps>) {
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const [joinLobby, { isLoading: isJoining }] = useJoinLobbyMutation();
  const [setReady, { isLoading: isUpdatingReady }] = useSetLobbyReadyMutation();

  const currentUserId = user?.sub ?? user?.email ?? "current-user";
  const currentMember = lobby.members.find(
    (member) => member.userId === currentUserId
  );
  const isHost = lobby.hostUserId === currentUserId;

  const handleJoin = async () => {
    try {
      const result = await joinLobby({ lobbyId: lobby.id }).unwrap();
      dispatch(GameplayEvents.lobbyUpdated(result));
    } catch (error) {
      dispatch(
        GameplayEvents.gameplayError(
          error instanceof Error ? error.message : "Unable to join lobby"
        )
      );
    }
  };

  const handleReadyToggle = async () => {
    const nextReadyState = !(currentMember?.isReady ?? false);

    try {
      const result = await setReady({
        lobbyId: lobby.id,
        body: { isReady: nextReadyState },
      }).unwrap();
      dispatch(GameplayEvents.lobbyUpdated(result));
    } catch (error) {
      dispatch(
        GameplayEvents.gameplayError(
          error instanceof Error
            ? error.message
            : "Unable to update ready state"
        )
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="size-4" />
          Lobby for {modeName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border p-3 text-sm text-muted-foreground">
          <p>Status: {lobby.status}</p>
          <p>Host: {lobby.hostUserId}</p>
        </div>
        <div className="space-y-2">
          {lobby.members.map((member) => (
            <div
              key={member.userId}
              className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
            >
              <span>{member.username}</span>
              <div className="flex items-center gap-2">
                {member.isReady ? (
                  <CheckCircle2 className="size-4 text-green-600" />
                ) : null}
                <span className="text-muted-foreground">
                  {member.isReady ? "Ready" : "Waiting"}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleJoin} disabled={isJoining}>
            {isJoining ? "Joining..." : "Join lobby"}
          </Button>
          <Button
            variant="outline"
            onClick={handleReadyToggle}
            disabled={isUpdatingReady || !currentMember}
          >
            {isUpdatingReady
              ? "Updating..."
              : currentMember?.isReady
                ? "Unmark ready"
                : "Mark ready"}
          </Button>
          {isHost && (
            <Button onClick={onStartGame} disabled={!canStart}>
              Start game
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
