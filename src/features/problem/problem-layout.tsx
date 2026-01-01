"use client";

import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { Problem } from "../problems/models/problem";
import { routerConfig } from "@/router-config";
import ProblemActions from "./problem-actions/problem-actions";
import { useProblemSetup } from "./api/get-problem-setup";
import { useEffect } from "react";
import ProblemEditor from "./problem-editor/problem-editor";
import { useProblemEditorStore } from "./problem-editor-store";
import ProblemCodeEditorLanguageSelect from "./problem-editor/problem-editor-language-select/problem-editor-language-select";

type ProblemLayoutProps = {
  problem: Problem;
  accessToken?: string;
};

export default function ProblemLayout({
  problem,
  accessToken,
}: ProblemLayoutProps) {
  const languageVersion = useProblemEditorStore((s) => s.getLanguageVersion());
  const setProblem = useProblemEditorStore((s) => s.setProblem);
  const setSetup = useProblemEditorStore((s) => s.setSetup);

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
        <div className="px-1 py-1 flex flex-1 gap-3 w-fit">
          <ProblemActions
            className="flex items-center gap-2 ml-auto"
            accessToken={accessToken ?? ""}
          />
          <ProblemCodeEditorLanguageSelect className="ml-auto" />
        </div>
      }
    >
      <div className="h-full">
        <ProblemEditor />
      </div>
    </SidebarLayout>
  );
}
