import ProblemLayout from "@/features/problem/problem-layout";
import {
  getProblemBySlug,
  getProblemBySlugQueryOptions,
} from "@/features/problems/api/get-problem-by-slug";
import { auth0 } from "@/lib/auth0";
import { getAccessToken } from "@auth0/nextjs-auth0";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;

  const problem = await getProblemBySlug({ slug });

  return {
    title: problem.title,
    description: problem.question,
  };
};

const preloadData = async (slug: string) => {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(getProblemBySlugQueryOptions(slug)),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return {
    dehydratedState,
    queryClient,
  };
};

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const session = await auth0.getSession();
  const accessToken = session ? (await auth0.getAccessToken()).token : "";

  const { dehydratedState, queryClient } = await preloadData(slug);

  const problem = queryClient.getQueryData(
    getProblemBySlugQueryOptions(slug).queryKey
  );

  if (!problem) {
    return <div>Problem not found</div>;
  }

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProblemLayout problem={problem} accessToken={accessToken} />
    </HydrationBoundary>
  );
}
