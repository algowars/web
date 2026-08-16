import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import { GameActions } from "../../state/game-actions";
import { selectCurrentGameId } from "../../state/game-slice";

export default function ForfeitButton() {
  const dispatch = useAppDispatch();
  const gameId = useAppSelector(selectCurrentGameId);

  const forfeitGame = () => {
    if (gameId) {
      dispatch(GameActions.forfeitGameRequested(gameId));
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="ml-auto" variant="destructive" size="sm">
          Forfeit
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Forfeit this game?</AlertDialogTitle>
          <AlertDialogDescription>
            Your game will end immediately and cannot be resumed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={forfeitGame}>
            Forfeit game
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
