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
  const getResolvedVersion = useProblemEditorStore((s) => s.getResolvedVersion);
  const currentSetup = useProblemEditorStore((s) => s.setup);
  const selectedLanguageVersionId =
    getResolvedVersion()?.id ?? problem.availableLanguages[0].versions[0].id;
  const { data: setup } = useProblemSetup({
    problemId: problem.id,
    languageVersionId: selectedLanguageVersionId,
  });

  const setProblem = useProblemEditorStore((s) => s.setProblem);
  const setSetup = useProblemEditorStore((s) => s.setSetup);

  useEffect(() => {
    setProblem(problem);
  }, [problem]);

  useEffect(() => {
    setSetup(setup);
  }, [setup, setSetup]);

  console.log("DATA: ", currentSetup, currentVersion, setup);

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
