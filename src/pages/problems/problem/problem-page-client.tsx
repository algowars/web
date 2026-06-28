import { fetchProblemBySlug } from "@/domains/problem/api/problem-server-api";
import { notFound } from "next/navigation";
import ProblemLayout from "./problem-layout";

type ProblemPageClientProps = {
  slug: string;
};

export default async function ProblemPage({ slug }: ProblemPageClientProps) {
  const response = await fetchProblemBySlug({ slug });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    notFound();
  }

  const problem = await response.json();

  if (!problem) {
    notFound();
  }

  return <ProblemLayout problem={problem} />;
}
