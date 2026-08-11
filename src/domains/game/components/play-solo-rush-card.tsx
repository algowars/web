"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import PlayCard from "./play-card";
import { Zap } from "lucide-react";
import { ComponentProps, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import { useHasMounted } from "@/shared/hooks/use-has-mounted";
import { selectGameModeByKey } from "../state/game-modes-slice";
import { GameModeKey } from "../models/game-mode";
import { GameActions } from "../state/game-actions";
import { selectCreatedGameId, selectIsCreatingGame } from "../state/game-slice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";
import { routerConfig } from "@/shared/router-config";

function formatDuration(durationSeconds: number) {
  const durationMinutes = durationSeconds / 60;
  return `${durationMinutes} minute${durationMinutes === 1 ? "" : "s"}`;
}

function formatDurationValue(durationSeconds: number) {
  return durationSeconds / 60;
}

export default function PlaySoloRushCard(
  props: Readonly<ComponentProps<"div">>
) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<string>();
  const gameMode = useAppSelector(selectGameModeByKey(GameModeKey.SoloRush));
  const createdGameId = useAppSelector(selectCreatedGameId);
  const isCreating = useAppSelector(selectIsCreatingGame);
  const hasMounted = useHasMounted();
  const isAvailable = hasMounted && !!gameMode;
  const timeOptions = gameMode?.timeOptions ?? [];
  const defaultTimeOption = timeOptions.find((option) => option.isDefault);
  const defaultDuration = defaultTimeOption?.durationSeconds.toString();
  const effectiveSelectedDuration = selectedDuration ?? defaultDuration;
  const timeSummary = timeOptions.map((option) =>
    formatDurationValue(option.durationSeconds)
  );

  useEffect(() => {
    if (createdGameId) {
      router.push(routerConfig.gamePlay.execute({ gameId: createdGameId }));
    }
  }, [createdGameId, router]);

  const handleStart = async () => {
    if (!gameMode) {
      toast.error("Solo Rush game mode is not available.");
      return;
    }

    if (!effectiveSelectedDuration) {
      toast.error("Choose a time limit to start Solo Rush.");
      return;
    }

    dispatch(
      GameActions.createGameRequested({
        gameModeKey: gameMode.key,
        timeLimitInSeconds: Number(effectiveSelectedDuration),
      })
    );
  };

  return (
    <>
      <PlayCard
        {...props}
        color="lime"
        icon={Zap}
        header={"Solo Rush"}
        tidbit="Race the clock"
        description={
          "Solve as many problems as possible before the time runs out."
        }
        playerCount="1 player"
        time={
          timeSummary.length
            ? `${timeSummary.join(" / ")} minutes`
            : "No time limits available"
        }
        type="Ranked"
        disabled={!isAvailable}
        onClick={() => {
          setIsDialogOpen(true);
        }}
      />
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Choose your time limit</AlertDialogTitle>
            <AlertDialogDescription>
              Solo Rush is a time-based game mode where you try to solve as many
              problems as possible before the time runs out. Choose your time
              limit below to start playing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Select
            value={effectiveSelectedDuration ?? ""}
            onValueChange={setSelectedDuration}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a time limit" />
            </SelectTrigger>
            <SelectContent position="popper">
              {timeOptions.map((option) => (
                <SelectItem
                  key={option.durationSeconds}
                  value={option.durationSeconds.toString()}
                >
                  {formatDuration(option.durationSeconds)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={handleStart} disabled={isCreating}>
            {isCreating ? "Starting..." : "Start game"}
          </Button>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
