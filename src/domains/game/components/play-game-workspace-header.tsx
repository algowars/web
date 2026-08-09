"use client";

import { ModeToggle } from "@/shared/theme/mode-toggle";
import PlayGameTimer from "./play-game-timer";

export default function PlayGameWorkspaceHeader() {
  return (
    <header className="flex min-h-12 flex-1 items-center">
      <PlayGameTimer />
      <div className="ml-auto">
        <ModeToggle />
      </div>
    </header>
  );
}
