import React from "react";
import ProblemEditor from "./problem-editor/problem-editor";
import { ProblemProvider } from "./problem-context";
import ProblemActions from "./problem-actions/problem-actions";

type ProblemProps = {
  params: Promise<{ slug: string }>;
};

export default async function Problem({ params }: ProblemProps) {
  const slug = (await params).slug;

  return (
    <ProblemProvider slug={slug} defaultPreferredLanguageId={1}>
      <div className="flex flex-col h-full gap-3">
        <div className="flex-1">
          <ProblemEditor />
        </div>
        <footer className="flex">
          <ProblemActions className="ml-auto" />
        </footer>
      </div>
    </ProblemProvider>
  );
}
