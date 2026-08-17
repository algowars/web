import { useAppSelector } from "@/shared/state/hooks";
import { selectCreatedGameId } from "../state/game-slice";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { routerConfig } from "@/shared/router-config";

export function useGameCreatedRedirectListener() {
  const router = useRouter();
  const createdGameId = useAppSelector(selectCreatedGameId);
  const previousGameId = useRef(createdGameId);

  useEffect(() => {
    if (!createdGameId || createdGameId === previousGameId.current) {
      previousGameId.current = createdGameId;
      return;
    }

    previousGameId.current = createdGameId;
    router.push(routerConfig.gamePlay.execute({ gameId: createdGameId }));
  }, [createdGameId, router]);

  return null;
}
