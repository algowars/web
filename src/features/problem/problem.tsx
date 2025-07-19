import React from "react";
import ProblemEditor from "./problem-editor/problem-editor";

type ProblemProps = {
  params: Promise<{ slug: string }>;
};

export default async function Problem({ params }: ProblemProps) {
  const slug = (await params).slug;

  return <ProblemEditor slug={slug} />;
}
