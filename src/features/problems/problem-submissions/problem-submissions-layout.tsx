"use client";

import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { routerConfig } from "@/router-config";
import { Problem } from "../models/problem";

type ProblemLayoutProps = {
  problem: Problem;
  accessToken?: string;
};

export default function ProblemSubmissionsLayout({
  problem,
  accessToken,
}: ProblemLayoutProps) {

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
        }
      ]}
      defaultOpen={false}

    >
      <h1>TESTING</h1>
    </SidebarLayout>
  );
}
