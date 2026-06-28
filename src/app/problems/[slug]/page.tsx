import ProblemPageContent from "./problem-page-client";

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

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  return <ProblemPageContent slug={slug} />;
}
