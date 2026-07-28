import { fetchAvailableGames } from "../api/game-server-api";

export default async function availableGameModes() {
  const response = await fetchAvailableGames();

  if (response.status === 404 || !response.ok) {
    throw new Error("Failed to fetch available games");
  }

  return response.json();
}
