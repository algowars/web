"use client";

import { useEffect } from "react";
import { GameModeEvents } from "@/domains/gameplay/state/game-mode-events";
import { GameplayEvents } from "@/domains/gameplay/state/gameplay-slice";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import { Sparkles } from "lucide-react";
import {
  selectGameModes,
  selectGameModesError,
  selectIsLoadingGameModes,
  selectSelectedModeId,
} from "../state/gameplay-slice";

type GameplayModeSelectorProps = {
  onSelectMode: (modeId: string) => void;
};

export default function GameplayModeSelector({
  onSelectMode,
}: Readonly<GameplayModeSelectorProps>) {
  const dispatch = useAppDispatch();
  const selectedModeId = useAppSelector(selectSelectedModeId);
  const modes = useAppSelector(selectGameModes);
  const isLoading = useAppSelector(selectIsLoadingGameModes);
  const error = useAppSelector(selectGameModesError);

  useEffect(() => {
    dispatch(GameModeEvents.loadGameModesRequested());
  }, [dispatch]);

  if (isLoading && modes.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-muted-foreground">
          Loading game modes…
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-destructive">
          Unable to load game modes right now.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {modes.map((mode) => {
        const isSelected = selectedModeId === mode.id;
        return (
          <Card key={mode.id} className={isSelected ? "border-primary" : ""}>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="size-4" />
                  {mode.name}
                </CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">
                  {mode.description}
                </p>
              </div>
              <Badge variant={mode.isRanked ? "default" : "secondary"}>
                {mode.isRanked ? "Ranked" : "Casual"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {mode.ruleSteps.map((step) => (
                  <Badge key={`${mode.id}-${step.stepOrder}`} variant="outline">
                    {step.name} · {step.difficultyTier}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {mode.minPlayers}-{mode.maxPlayers} players ·{" "}
                  {mode.ruleSteps.length} ladder steps
                </p>
                <Button
                  onClick={() => {
                    dispatch(GameplayEvents.selectMode(mode.id));
                    onSelectMode(mode.id);
                  }}
                  variant={isSelected ? "default" : "outline"}
                >
                  {isSelected ? "Selected" : "Choose mode"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
