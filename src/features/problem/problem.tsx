"use client";

import React, { useEffect } from "react";
import { Problem as ProblemType } from "../problems/models/problem";
import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { routerConfig } from "@/router-config";
import { problemEditorStore } from "./state/problem-editor-store-old";
import { useProblemSetup } from "./api/get-problem-setup";
import ProblemEditor from "./problem-editor/problem-editor";
import ProblemActions from "./problem-actions/problem-actions";

type ProblemProps = {
  problem: ProblemType;
};

export default function Problem({ problem }: ProblemProps) {
  const currentVersion = problemEditorStore((s) => s.currentVersion);
  const setCurrentVersion = problemEditorStore((s) => s.setCurrentVersion);

  const selectedLanguageId = problem.availableLanguages.find((language) =>
    language.versions.some((v) => v.id === (currentVersion?.id ?? -1))
  )?.id;

  console.log("SELECTED LANGUAGE ID:", selectedLanguageId);

  const { data : setup } = useProblemSetup({
    problemId: problem.id,
    languageId: selectedLanguageId,
  });

  console.log("SETUP: ", setup);

  const setProblem = problemEditorStore((s) => s.setProblem);
  const setSetup = problemEditorStore((s) => s.setSetup);

  useEffect(() => {
    if (!selectedLanguageId) {
      setCurrentVersion(
        problem.availableLanguages[0]?.versions[0] ?? null
      );
    }

    setProblem(problem);
  }, [problem]);

  useEffect(() => {
    if (setup) {
      setSetup(setup);
    }
  }, [setup, setSetup])


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
