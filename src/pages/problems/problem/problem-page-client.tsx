import { fetchProblemBySlug } from "@/domains/problem/api/problem-server-api";
import type { Problem } from "@/domains/problem/models/problem";
import { auth0 } from "@/shared/lib/auth0";
import { notFound } from "next/navigation";
import ProblemLayout from "./problem-layout";

type ProblemPageClientProps = {
  slug: string;
};

export default async function ProblemPage({ slug }: ProblemPageClientProps) {
  let accessToken: string | undefined;

  try {
    const tokenSet = await auth0.getAccessToken();
    accessToken = tokenSet.token;
  } catch {
    accessToken = undefined;
  }

  const response = await fetchProblemBySlug({ slug, accessToken });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    notFound();
  }

  const problem = (await response.json()) as Problem;

  if (!problem) {
    notFound();
  }

  return <ProblemLayout problem={problem} />;
}
