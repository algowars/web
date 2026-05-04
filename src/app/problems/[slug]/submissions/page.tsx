import { getProblemBySlugQueryOptions } from "@/features/problems/api/get-problem-by-slug";
import { HydrationBoundary } from "@tanstack/react-query";
import ProblemSubmissionsLayout from "@/features/problem/problem-submissions/problem-submissionsLayout";
import { preloadData } from "../page";
import { notFound } from "next/navigation";

export default async function ProblemSubmissionsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  const { dehydratedState, queryClient } = await preloadData(slug);

  const problem = queryClient.getQueryData(
    getProblemBySlugQueryOptions(slug).queryKey
  );

  if (!problem) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProblemSubmissionsLayout problem={problem} />
    </HydrationBoundary>
  );
}
