import { useAppDispatch } from "@/shared/state/hooks";
import { useAppSelector } from "@/shared/state/hooks";
import { useEffect } from "react";
import { toast } from "sonner";
import { GameModesActions } from "../state/game-modes-actions";
import {
  selectGameModes,
  selectGameModesError,
} from "../state/game-modes-slice";

export function useAvailableGameModes() {
  const dispatch = useAppDispatch();
  const gameModes = useAppSelector(selectGameModes);
  const error = useAppSelector(selectGameModesError);

  useEffect(() => {
    dispatch(GameModesActions.availableModesRequested());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error("Error loading game modes", { description: error });
    }
  }, [error]);

  return { error, gameModes };
}
