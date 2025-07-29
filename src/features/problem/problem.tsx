import React from "react";
import ProblemEditor from "./problem-editor/problem-editor";
import { ProblemProvider } from "./problem-context";

type ProblemProps = {
  params: Promise<{ slug: string }>;
};

export default async function Problem({ params }: ProblemProps) {
  const slug = (await params).slug;

  return (
    <ProblemProvider slug={slug} defaultPreferredLanguageId={1}>
      <ProblemEditor />
    </ProblemProvider>
  );
}
