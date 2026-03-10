import { getProblemBySlugQueryOptions } from "@/features/problems/api/get-problem-by-slug";
import ProblemSubmissionsLayout from "@/features/problems/problem-submissions/problem-submissions-layout";
import { auth0 } from "@/lib/auth0";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

const preloadData = async (slug: string ) => {
    const queryClient = new QueryClient();

    await Promise.all([
        queryClient.prefetchQuery(getProblemBySlugQueryOptions(slug)),
    ]);

  const dehydratedState = dehydrate(queryClient);

  return {
    dehydratedState,
    queryClient,
  };
}

export default async function ProblemSubmissionsPage({
    params
}: {
    params: Promise<{ slug: string }>;
}) {
    const slug = (await params).slug;
    const session = await auth0.getSession();
    const accessToken = session ? (await auth0.getAccessToken()).token : "";

    const { dehydratedState, queryClient } = await preloadData(slug);

    const problem = queryClient.getQueryData(getProblemBySlugQueryOptions(slug).queryKey);

    if (!problem) {
        return <div>Problem not found</div>;
    }

    return (
        <HydrationBoundary state={dehydratedState}>
            <ProblemSubmissionsLayout problem={problem} accessToken={accessToken} />
        </HydrationBoundary>
    )
}