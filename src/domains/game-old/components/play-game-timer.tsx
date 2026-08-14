"use client";

import { Clock3 } from "lucide-react";
import { useAppSelector } from "@/shared/state/hooks";
import { Badge } from "@/shared/components/ui/badge";
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

const LOW_TIME_THRESHOLD_SECONDS = 60;

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
  const isLowTime =
    !isStarting && remainingSeconds <= LOW_TIME_THRESHOLD_SECONDS;

  return (
    <Badge
      aria-live="polite"
      aria-label={`${isStarting ? "Starting in" : "Time left"}: ${formatDuration(remainingSeconds)}`}
      variant={isLowTime ? "destructive" : "secondary"}
      className="h-7 gap-1.5 px-2.5 text-sm"
    >
      <Clock3 data-icon="inline-start" className="size-3.5" />
      <span>{isStarting ? "Starting in" : "Time left"}</span>
      <span className="tabular-nums">{formatDuration(remainingSeconds)}</span>
    </Badge>
  );
}
