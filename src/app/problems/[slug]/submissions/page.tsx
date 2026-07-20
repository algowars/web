import ProblemSubmissionsPageContext from "@/pages/problems/problem/submissions/problem-submissions-page-context";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;
  return {
    title: `Problem ${slug}`,
    description: "Solve coding problems on Algowars",
  };
};

export default async function ProblemSubmissionsPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const slug = (await params).slug;

  return <ProblemSubmissionsPageContext slug={slug} />;
}
