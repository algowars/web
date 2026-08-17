"use client";

import PlayCard from "@/domains/game/components/play-card";
import { Zap } from "lucide-react";
import { ComponentProps, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { selectGameModeByKey } from "../state/game-modes-slice";
import { GameModeKey } from "../models/game-mode";
import { selectIsCreatingGame } from "../state/game-slice";
import { GameActions } from "../state/game-actions";
import { useGameCreatedRedirectListener } from "../hooks/use-game-created-redirect-listener";

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
  useGameCreatedRedirectListener();

  const dispatch = useAppDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<string>();
  const gameMode = useAppSelector(selectGameModeByKey(GameModeKey.SoloRush));
  const isCreating = useAppSelector(selectIsCreatingGame);
  const isAvailable = !!gameMode;
  const timeOptions = gameMode?.timeOptions ?? [];
  const defaultTimeOption = timeOptions.find((option) => option.isDefault);
  const defaultDuration = defaultTimeOption?.durationSeconds.toString();
  const effectiveSelectedDuration = selectedDuration ?? defaultDuration;
  const timeSummary = timeOptions.map((option) =>
    formatDurationValue(option.durationSeconds)
  );

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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose your time limit</DialogTitle>
            <DialogDescription>
              Solo Rush is a time-based game mode where you try to solve as many
              problems as possible before the time runs out. Choose your time
              limit below to start playing.
            </DialogDescription>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>
    </>
  );
}
