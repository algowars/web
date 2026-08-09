"use client";

import { Clock3 } from "lucide-react";
import { useAppSelector } from "@/shared/state/hooks";
import {
  selectCurrentGame,
  selectGameCountdownSeconds,
  selectGameTimeRemainingSeconds,
} from "../state/game-slice";

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export default function PlayGameTimer() {
  const game = useAppSelector(selectCurrentGame);
  const countdownSeconds = useAppSelector(selectGameCountdownSeconds);
  const gameTimeRemainingSeconds = useAppSelector(
    selectGameTimeRemainingSeconds
  );

  if (!game) {
    return null;
  }

  const isStarting = countdownSeconds !== null;
  const remainingSeconds = isStarting
    ? countdownSeconds
    : (gameTimeRemainingSeconds ?? game.timeLimitInSeconds);

  return (
    <div
      aria-live="polite"
      className="flex items-center gap-2 text-sm font-medium"
    >
      <Clock3 className="size-4 text-muted-foreground" />
      <span className="text-muted-foreground">
        {isStarting ? "Starting in" : "Time left"}
      </span>
      <span className="tabular-nums text-base">
        {formatDuration(remainingSeconds)}
      </span>
    </div>
  );
}
