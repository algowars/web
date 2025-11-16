"use client";

import React, { useEffect } from "react";
import { Problem as ProblemType } from "../problems/models/problem";
import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { routerConfig } from "@/router-config";
import { useProblemEditor } from "./state/problem-editor-store";
import { useProblemSetup } from "./api/get-problem-setup";
import ProblemEditor from "./problem-editor/problem-editor";
import ProblemActions from "./problem-actions/problem-actions";

type ProblemProps = {
  problem: ProblemType;
};

export default function Problem({ problem }: ProblemProps) {
  const selectedLanguageId = problem.availableLanguages[0].id;

  const setupQuery = useProblemSetup({
    problemId: problem.id,
    languageId: selectedLanguageId,
  });
  const setProblem = useProblemEditor((s) => s.setProblem);
  const setSetup = useProblemEditor((s) => s.setSetup);

  useEffect(() => {
    if (setupQuery.data) {
      setProblem(problem);
      setSetup(setupQuery.data);
    }
  }, [problem, setupQuery.data, setProblem, setSetup]);

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
