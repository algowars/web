import { env } from "@/env";

type FetchProblemBySlugInput = {
  slug: string;
};

export async function fetchProblemBySlug({ slug }: FetchProblemBySlugInput) {
  return fetch(`${env.NEXT_PUBLIC_API_SERVER_URL}/api/v1/problem/${slug}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
