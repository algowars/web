import {
  getProblemBySlug,
  getProblemBySlugQueryOptions,
} from "@/domains/problem/api/get-problem-by-slug";
import ProblemLayout from "@/pages/problems/problem/problem-layout";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  try {
    const slug = (await params).slug;
    const problem = await getProblemBySlug({ slug });
    return {
      title: problem.title,
      description: problem.question,
    };
  } catch {
    return { title: "Problem" };
  }
};

export const preloadData = async (slug: string) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["problem", slug],
    queryFn: () => getProblemBySlug({ slug }),
  });

  const dehydratedState = dehydrate(queryClient);

  return { dehydratedState, queryClient };
};

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  const { dehydratedState, queryClient } = await preloadData(slug);

  const problem = queryClient.getQueryData(
    getProblemBySlugQueryOptions({ slug }).queryKey
  );

  if (!problem) {
    return notFound();
  }

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProblemLayout problem={problem} />
    </HydrationBoundary>
  );
}
