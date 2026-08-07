import { env } from "@/env";
import { auth0 } from "@/shared/lib/auth0";

type FetchGameByIdInput = {
  gameId: string;
};

export async function fetchGameById({ gameId }: FetchGameByIdInput) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  try {
    const { token } = await auth0.getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  } catch {}

  return fetch(`${env.NEXT_PUBLIC_API_SERVER_URL}/api/v1/game/${encodeURIComponent(gameId)}`, {
    headers,
  });
}
