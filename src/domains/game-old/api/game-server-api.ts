import { env } from "@/env";

type FetchGameByIdInput = {
  gameId: string;
};

export async function getGameById({ gameId }: Readonly<FetchGameByIdInput>) {
  return fetch(`${env.NEXT_PUBLIC_API_SERVER_URL}/api/v1/game/${gameId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
