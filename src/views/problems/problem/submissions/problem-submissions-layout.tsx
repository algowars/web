"use client";
import { Problem } from "@/domains/problem/models/problem";
import ProblemSubmissionsFilter from "@/domains/problem/problem-submissions/components/problem-submissions-filter";
import ProblemSubmissionsHeader from "@/domains/problem/problem-submissions/components/problem-submissions-header";
import SidebarLayout from "@/shared/layouts/sidebar-layout/sidebar-layout";
import ProblemSubmissions from "@/domains/problem/problem-submissions/components/problem-submissions";

type ProblemSubmissionsLayoutProps = {
  problem: Problem;
  isAuthenticated: boolean;
};

export default function ProblemSubmissionsLayout({
  problem,
  isAuthenticated,
}: Readonly<ProblemSubmissionsLayoutProps>) {
  return (
    <SidebarLayout breadcrumbs={[]}>
      <div className="@container px-2 md:px-4 pb-2 md:pb-4 grid grid-cols-12 gap-4">
        <ProblemSubmissionsHeader
          problem={problem}
          className="col-span-12 order-1"
        />
        <ProblemSubmissions
          className="col-span-12 @3xl:col-span-8 order-3 @3xl:order-2"
          problem={problem}
          isAuthenticated={isAuthenticated}
        />
        <ProblemSubmissionsFilter className="col-span-12 @3xl:col-span-4 order-2 @3xl:order-3  @3xl:sticky @3xl:top-0" />
      </div>
    </SidebarLayout>
  );
}
