"use client";

import React, { useEffect } from "react";
import { Problem as ProblemType } from "../problems/models/problem";
import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { routerConfig } from "@/router-config";
import { useProblemSetup } from "./api/get-problem-setup";
import ProblemEditor from "./problem-editor/problem-editor";
import ProblemActions from "./problem-actions/problem-actions";
import { useProblemEditorStore } from "./state/problem-editor-store";

type ProblemProps = {
  problem: ProblemType;
};

export default function Problem({ problem }: ProblemProps) {
  const currentVersion = useProblemEditorStore((s) => s.currentVersion);
  const setCurrentVersion = useProblemEditorStore((s) => s.setCurrentVersion);
  const getResolvedLanguage = useProblemEditorStore(
    (s) => s.getResolveLanguage
  );

  const selectedLanguageId = getResolvedLanguage()?.id;
  const { data: setup } = useProblemSetup({
    problemId: problem.id,
    languageId: selectedLanguageId,
  });

  const setProblem = useProblemEditorStore((s) => s.setProblem);
  const setSetup = useProblemEditorStore((s) => s.setSetup);

  useEffect(() => {
    setProblem(problem);
  }, [problem]);

  useEffect(() => {
    if (setup) {
      setSetup(setup);
    }
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
