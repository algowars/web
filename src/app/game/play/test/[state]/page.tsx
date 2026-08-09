import Forbidden from "@/app/game/play/[gameId]/forbidden";
import NotFound from "@/app/game/play/[gameId]/not-found";
import { notFound } from "next/navigation";

type PlayGameTestPageProps = {
  params: Promise<{ state: string }>;
};

export default async function PlayGameTestPage({
  params,
}: Readonly<PlayGameTestPageProps>) {
  const { state } = await params;

  if (state === "not-found") {
    return <NotFound />;
  }

  if (state === "forbidden") {
    return <Forbidden />;
  }

  notFound();
}
