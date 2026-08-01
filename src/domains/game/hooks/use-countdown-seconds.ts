import { useEffect, useState } from "react";

/**
 * Ticks once a second and returns the number of whole seconds remaining
 * until `endTimeMs`, clamped to zero. Returns `null` until the first
 * client-side tick has run — `Date.now()` differs between the server
 * render and the client's first paint, so seeding real state up front
 * would risk a hydration mismatch. Solo Rush is "solve as many problems
 * as you can before the clock runs out" — this drives the header
 * countdown for that overall game timer (not a per-problem/per-step
 * timer).
 */
export function useCountdownSeconds(endTimeMs: number): number | null {
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    setRemainingMs(endTimeMs - Date.now());

    const interval = setInterval(() => {
      setRemainingMs(endTimeMs - Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [endTimeMs]);

  return remainingMs === null ? null : Math.max(0, Math.ceil(remainingMs / 1000));
}

export function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
