"use client";

import GameplayGameScreen from "@/domains/gameplay/components/gameplay-game-screen";
import GameplayLobbyCard from "@/domains/gameplay/components/gameplay-lobby-card";
import GameplayModeSelector from "@/domains/gameplay/components/gameplay-mode-selector";
import {
  useCreateLobbyMutation,
  useStartGameMutation,
} from "@/domains/gameplay/api/gameplay-api";
import {
  GameplayEvents,
  selectCurrentGame,
  selectCurrentLobby,
  selectGameplayError,
  selectSelectedMode,
} from "@/domains/gameplay/state/gameplay-slice";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import { AlertCircle, Sparkles } from "lucide-react";

export default function GameplayDashboard() {
  const dispatch = useAppDispatch();
  const currentLobby = useAppSelector(selectCurrentLobby);
  const currentGame = useAppSelector(selectCurrentGame);
  const error = useAppSelector(selectGameplayError);
  const selectedMode = useAppSelector(selectSelectedMode);
  const [createLobby] = useCreateLobbyMutation();
  const [startGame] = useStartGameMutation();

  const handleCreateLobby = async (modeId: string) => {
    try {
      const lobby = await createLobby({ gameModeId: modeId }).unwrap();
      dispatch(GameplayEvents.lobbyCreated(lobby));
    } catch (err) {
      dispatch(
        GameplayEvents.gameplayError(
          err instanceof Error ? err.message : "Unable to create lobby"
        )
      );
    }
  };

  const handleStartGame = async () => {
    if (!currentLobby?.id) {
      return;
    }

    try {
      const game = await startGame({ lobbyId: currentLobby.id }).unwrap();
      dispatch(GameplayEvents.gameStarted(game));
    } catch (err) {
      dispatch(
        GameplayEvents.gameplayError(
          err instanceof Error ? err.message : "Unable to start game"
        )
      );
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4" />
            Gameplay Loop
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Pick a game mode, create or join a lobby, and then start a match to
            work through the ladder.
          </p>
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          {!currentGame ? (
            <>
              <GameplayModeSelector onSelectMode={handleCreateLobby} />
              {selectedMode && currentLobby ? (
                <GameplayLobbyCard
                  lobby={currentLobby}
                  modeName={selectedMode.name}
                  canStart={currentLobby.members.every(
                    (member) => member.isReady
                  )}
                  onStartGame={handleStartGame}
                />
              ) : null}
            </>
          ) : (
            <GameplayGameScreen />
          )}
        </CardContent>
      </Card>
      {!currentGame ? (
        <Card>
          <CardHeader>
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            After a submission is accepted, the game state will refresh
            automatically so you can continue to the next ladder step.
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
