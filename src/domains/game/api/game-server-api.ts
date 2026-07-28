import { env } from "@/env";

export async function fetchAvailableGames() {
  return fetch(`${env.NEXT_PUBLIC_API_SERVER_URL}/api/v1/game`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
