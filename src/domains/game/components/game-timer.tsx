import CountdownTimer from "@/shared/components/countdown-timer/countdown-timer";
import { Game, GameStatus } from "../models/game";
import { Badge } from "@/shared/components/ui/badge";
import { Hourglass } from "lucide-react";

type GameTimerProps = {
  game: Game;
  onTimeExpired: () => void;
};

export default function GameTimer({
  game,
  onTimeExpired,
}: Readonly<GameTimerProps>) {
  if (game.status === GameStatus.Pending || !game.startedAt) {
    return <PendingTimer timeLimitInSeconds={game.timeLimitInSeconds} />;
  }

  if (
    game.status === GameStatus.Completed ||
    game.status === GameStatus.Cancelled
  ) {
    return null;
  }

  return (
    <CountdownTimer
      key={new Date(game.startedAt).getTime()}
      startedAt={game.startedAt}
      timeLimitInSeconds={game.timeLimitInSeconds}
      onComplete={onTimeExpired}
    />
  );
}

type PendingTimerProps = {
  timeLimitInSeconds: number;
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

function PendingTimer({ timeLimitInSeconds }: Readonly<PendingTimerProps>) {
  return (
    <Badge
      aria-live="polite"
      aria-label={`Not started. Time limit: ${formatDuration(timeLimitInSeconds)}`}
      variant="secondary"
      className="h-7 gap-1.5 px-2.5 text-sm"
    >
      <Hourglass data-icon="inline-start" className="size-3.5" />
      <span>Not started</span>
      <span className="tabular-nums text-muted-foreground">
        {formatDuration(timeLimitInSeconds)}
      </span>
    </Badge>
  );
}
