import { env } from "@/env";

type FetchProblemBySlugInput = {
  slug: string;
  accessToken?: string;
};

export async function fetchProblemBySlug({
  slug,
  accessToken,
}: FetchProblemBySlugInput) {
  return fetch(`${env.NEXT_PUBLIC_API_SERVER_URL}/api/v1/problem/${slug}`, {
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
}
