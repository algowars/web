"use client";

import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { Problem } from "@/features/problems/models/problem";
import { routerConfig } from "@/router-config";
import ProblemSubmissionsHeader from "./problem-submissions-header";
import ProblemSubmissions from "./problem-submissions";
import ProblemSubmissionsAlert from "./problem-submissions-alert";
import { useProblemSubmissionsStore } from "./problem-submissions-store";

type ProblemSubmissionsLayoutProps = {
  problem: Problem;
};

export default function ProblemSubmissionsLayout({
  problem,
}: ProblemSubmissionsLayoutProps) {
  const initProblem = useProblemSubmissionsStore((s) => s.initProblem);
  initProblem(problem);

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
          name: problem.slug,
        },
        {
          url: routerConfig.problemSubmissions.execute({ slug: problem.slug }),
          name: "Submissions",
        },
      ]}
      defaultOpen={true}
    >
      <div className="grid grid-cols-12 gap-3">
        <ProblemSubmissionsHeader className="col-span-12" />
        <ProblemSubmissionsAlert className="col-span-12" />
        {!!problem ? <ProblemSubmissions /> : null}
      </div>
    </SidebarLayout>
  );
}
