import GameLayout from "@/views/game-layout";
import { fetchGameById } from "@/domains/game/api/game-server-api";
import { forbidden, notFound, unauthorized } from "next/navigation";

type PageProps = {
  params: Promise<{ gameId: string }>;
};

export const generateMetadata = async ({ params }: PageProps) => {
  const gameId = (await params).gameId;
  return {
    title: `Game ${gameId}`,
    description: "Algowars game workspace",
  };
};

export default async function GamePage({ params }: Readonly<PageProps>) {
  const gameId = (await params).gameId;
  const response = await fetchGameById({ gameId });

  if (response.status === 401) {
    unauthorized();
  }

  if (response.status === 403) {
    forbidden();
  }

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    notFound();
  }

  const game = await response.json();
  console.log("GAME: ", game);
  if (!game) {
    notFound();
  }

  return <GameLayout game={game} />;
}
