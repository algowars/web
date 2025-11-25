"use client";

import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { Problem } from "../problems/models/problem";
import { routerConfig } from "@/router-config";
import ProblemActions from "./problem-actions/problem-actions";
import { useProblemSetup } from "./api/get-problem-setup";
import { useEffect } from "react";
import ProblemEditor from "./problem-editor/problem-editor";
import { useProblemEditor } from "./problem-editor-store";

type ProblemLayoutProps = {
  problem: Problem;
};

export default function ProblemLayout({ problem }: ProblemLayoutProps) {
  const { languageVersion, setProblem, setSetup } = useProblemEditor();

  const { data: setup } = useProblemSetup({
    problemId: problem.id,
    languageVersionId: languageVersion?.id,
  });

  useEffect(() => {
    setProblem(problem);
  }, [problem, setProblem]);

  useEffect(() => {
    setSetup(setup ?? null);
  }, [setup, setSetup]);

  return (
    <SidebarLayout
      breadcrumbs={[
        {
          url: routerConfig.home.path,
          name: "Home",
        },
        {
          url: routerConfig.problems.path,
          name: "Problems",
        },
        {
          url: routerConfig.problem.execute({ slug: problem.slug }),
          name: problem.title,
        },
      ]}
      defaultOpen={false}
      headerItems={
        <ProblemActions className="ml-auto flex items-center gap-2" />
      }
    >
      <div className="h-full">
        <ProblemEditor />
      </div>
    </SidebarLayout>
  );
}
