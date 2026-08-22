"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useGameModes } from "@/domains/game/api/use-game-modes";
import { useCreateGame } from "@/domains/game/api/create-game";
import { GameModeKey } from "../models/game-mode";

function formatDuration(durationSeconds: number) {
  const durationMinutes = durationSeconds / 60;
  return `${durationMinutes} minute${durationMinutes === 1 ? "" : "s"}`;
}

type CreateGameDialogProps = {
  defaultModeKey?: string;
};

export default function CreateGameDialog({
  defaultModeKey,
}: Readonly<CreateGameDialogProps>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedModeKey, setSelectedModeKey] = useState<string | undefined>(
    defaultModeKey
  );
  const [selectedDuration, setSelectedDuration] = useState<string>();

  const { data: gameModes } = useGameModes();
  const joinableModes = (gameModes ?? []).filter(
    (mode) => mode.key !== GameModeKey.SoloRush
  );

  const selectedMode = joinableModes.find(
    (mode) => mode.key === selectedModeKey
  );
  const defaultTimeOption = selectedMode?.timeOptions.find((o) => o.isDefault);
  const defaultDuration = defaultTimeOption?.durationSeconds.toString();
  const effectiveSelectedDuration = selectedDuration ?? defaultDuration;

  const { mutate: createGame, isPending: isCreating } = useCreateGame();

  const onSelectMode = (modeKey: string) => {
    setSelectedModeKey(modeKey);
    setSelectedDuration(undefined);
  };

  const handleCreate = () => {
    if (!selectedMode || !effectiveSelectedDuration) {
      toast.error("Choose a mode and time limit to create a game.");
      return;
    }

    createGame(
      {
        gameModeKey: selectedMode.key,
        timeLimitInSeconds: Number(effectiveSelectedDuration),
      },
      {
        onSuccess: () => {
          toast.success("Game created");
          setIsDialogOpen(false);
          setSelectedDuration(undefined);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create game");
        },
      }
    );
  };

  return (
    <>
      <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
        <Plus size={16} /> Create Game
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a game</DialogTitle>
            <DialogDescription>
              Choose a mode and time limit. Your game will appear in the list
              for others to join.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <Select value={selectedModeKey ?? ""} onValueChange={onSelectMode}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a mode" />
              </SelectTrigger>
              <SelectContent position="popper">
                {joinableModes.map((mode) => (
                  <SelectItem key={mode.id} value={mode.key}>
                    {mode.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={effectiveSelectedDuration ?? ""}
              onValueChange={setSelectedDuration}
              disabled={!selectedMode}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a time limit" />
              </SelectTrigger>
              <SelectContent position="popper">
                {(selectedMode?.timeOptions ?? []).map((option) => (
                  <SelectItem
                    key={option.durationSeconds}
                    value={option.durationSeconds.toString()}
                  >
                    {formatDuration(option.durationSeconds)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create game"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
