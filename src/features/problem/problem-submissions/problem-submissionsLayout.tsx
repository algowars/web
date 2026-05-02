"use client";

import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { Problem } from "@/features/problems/models/problem";
import { routerConfig } from "@/router-config";
import { useEffect } from "react";
import { useProblemSubmissionsStore } from "./problem-submissions-store";
import ProblemSubmissionsHeader from "./problem-submissions-header";

type ProblemSubmissionsLayoutProps = {
  problem: Problem;
};

export default function ProblemSubmissionsLayout({
  problem,
}: ProblemSubmissionsLayoutProps) {
  const setProblem = useProblemSubmissionsStore((s) => s.setProblem);

  useEffect(() => {
    setProblem(problem);
  }, [problem, setProblem]);

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
        {
          url: routerConfig.problemSubmissions.execute({ slug: problem.slug }),
          name: "Submissions",
        },
      ]}
      defaultOpen={true}
    >
      <ProblemSubmissionsHeader />
    </SidebarLayout>
  );
}
