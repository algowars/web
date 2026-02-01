import ProblemSubmissionsLayout from "@/features/problem-submissions/problem-submissions-layout";
import { getProblemSubmissionsQueryOptions } from "@/features/problem/api/get-problem-submissions";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const preloadData = async (slug: string) => {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(getProblemSubmissionsQueryOptions(slug)),
  ]);

  const dehydratedState = dehydrate(queryClient);
  const problemSubmission = queryClient.getQueryData(
    getProblemSubmissionsQueryOptions(slug).queryKey
  );

  return {
    dehydratedState,
    problemSubmission,
  };
};

export default async function ProblemSubmissionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { dehydratedState, problemSubmission } = await preloadData(slug);

  if (!problemSubmission) {
    return <h1>Error loading problem submissions.</h1>
  }

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProblemSubmissionsLayout problemSubmission={problemSubmission}/>
    </HydrationBoundary>
  )
}