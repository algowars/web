"use client";

import { useAvailableGameMode } from "../hooks/use-available-game-mode";
import PlayCard from "./play-card";
import { GameModeType } from "../models/game-mode";
import { Zap } from "lucide-react";
import { ComponentProps, useState } from "react";
import {
  TIME_LIMIT_OPTIONS_SECONDS,
  TimeLimitSeconds,
  useCreateLobbyMutation,
  useSetLobbyReadyMutation,
  useStartGameMutation,
} from "../api/game-api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

const TIME_LIMIT_LABELS: Record<TimeLimitSeconds, string> = {
  300: "5 minutes",
  600: "10 minutes",
  900: "15 minutes",
};

export default function PlaySoloRushCard(
  props: Readonly<ComponentProps<"div">>
) {
  const { gameMode: soloRush } = useAvailableGameMode(GameModeType.SoloRush);

  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [timeLimitSeconds, setTimeLimitSeconds] =
    useState<TimeLimitSeconds>(600);
  const [createLobby, { isLoading: isCreatingLobby }] =
    useCreateLobbyMutation();
  const [setLobbyReady] = useSetLobbyReadyMutation();
  const [startGame] = useStartGameMutation();

  const handleStart = async () => {
    if (!soloRush) {
      toast.error("Game mode unavailable");
      return;
    }

    try {
      const lobby = await createLobby({
        gameModeId: soloRush.id,
        timeLimitSeconds,
      }).unwrap();
      // For Solo Rush (capacity 1), host must mark ready — mark host ready so lobby becomes Ready
      await setLobbyReady({
        lobbyId: lobby.id,
        body: { isReady: true },
      }).unwrap();
      const game = await startGame({ lobbyId: lobby.id }).unwrap();

      setIsDialogOpen(false);
      router.push(`/game/${encodeURIComponent(game.id)}`);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to start game";
      toast.error(message);
    }
  };

  return (
    <>
      <PlayCard
        {...props}
        color="lime"
        icon={Zap}
        header={soloRush?.name ?? "Solo Rush"}
        tidbit="Race the clock"
        description={
          soloRush?.description ??
          "Solve as many problems as possible before the time runs out."
        }
        playerCount="1 player"
        time={"5 / 10 / 15 minutes"}
        onClick={() => setIsDialogOpen(true)}
        type={soloRush?.isRanked ? "Ranked" : "Practice"}
        disabled={!soloRush}
      />
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Choose your time limit</AlertDialogTitle>
            <AlertDialogDescription>
              How long should the clock run for this Solo Rush game?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Select
            value={String(timeLimitSeconds)}
            onValueChange={(value) =>
              setTimeLimitSeconds(Number(value) as TimeLimitSeconds)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Time limit" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                {TIME_LIMIT_OPTIONS_SECONDS.map((seconds) => (
                  <SelectItem key={seconds} value={String(seconds)}>
                    {TIME_LIMIT_LABELS[seconds as TimeLimitSeconds]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isCreatingLobby} onClick={handleStart}>
              {isCreatingLobby ? "Starting..." : "Start game"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
