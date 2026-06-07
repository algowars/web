import ProblemLayout from "@/pages/problems/problem/problem-layout";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  try {
    const slug = (await params).slug;
    const problem = await getProblemBySlug({ slug });
    return { title: problem.title, description: problem.question };
  } catch {
    return { title: "Problem" };
  }
};

export const preloadData = async (slug: string) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(getProblemBySlugQueryOptions(slug));
}

export default function ProblemPage() {
  return <ProblemLayout />;
}
