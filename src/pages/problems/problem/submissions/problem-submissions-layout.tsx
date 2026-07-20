"use client";
import { ProblemSubmissionsEvents } from "@/domains/problem/problem-submissions/state/problem-submissions-events";
import { useEffect } from "react";
import { Problem } from "@/domains/problem/models/problem";
import ProblemSubmissionsCard from "@/domains/problem/problem-submissions/components/problem-submissions-card";
import ProblemSubmissionsFilter from "@/domains/problem/problem-submissions/components/problem-submissions-filter";
import ProblemSubmissionsHeader from "@/domains/problem/problem-submissions/components/problem-submissions-header";
import SidebarLayout from "@/shared/layouts/sidebar-layout/sidebar-layout";
import { useAppDispatch } from "@/shared/state/hooks";

type ProblemSubmissionsLayoutProps = {
  problem: Problem;
  isAuthenticated: boolean;
};

export default function ProblemSubmissionsLayout({
  problem,
  isAuthenticated,
}: Readonly<ProblemSubmissionsLayoutProps>) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(
        ProblemSubmissionsEvents.loadSubmissionsRequested({
          problemId: problem.id,
        })
      );
    }
  }, [dispatch, isAuthenticated, problem.id]);
  return (
    <SidebarLayout breadcrumbs={[]} className="grid grid-cols-12 gap-4">
      <ProblemSubmissionsHeader problem={problem} className="col-span-12" />
      <ProblemSubmissionsCard className="col-span-8" />
      <ProblemSubmissionsFilter className="col-span-4" />
    </SidebarLayout>
  );
}
