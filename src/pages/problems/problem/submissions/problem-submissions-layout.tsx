"use client";
import { ProblemSubmissionsEvents } from "@/domains/problem/problem-submissions/state/problem-submissions-events";
import { useEffect } from "react";
import { Problem } from "@/domains/problem/models/problem";
import ProblemSubmissionsFilter from "@/domains/problem/problem-submissions/components/problem-submissions-filter";
import ProblemSubmissionsHeader from "@/domains/problem/problem-submissions/components/problem-submissions-header";
import SidebarLayout from "@/shared/layouts/sidebar-layout/sidebar-layout";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import {
  selectProblemSubmissionsPage,
  selectProblemSubmissionsSize,
  selectProblemSubmissionsTimestamp,
} from "@/domains/problem/problem-submissions/state/problem-submissions-slice";
import ProblemSubmissions from "@/domains/problem/problem-submissions/components/problem-submissions";

type ProblemSubmissionsLayoutProps = {
  problem: Problem;
  isAuthenticated: boolean;
};

export default function ProblemSubmissionsLayout({
  problem,
  isAuthenticated,
}: Readonly<ProblemSubmissionsLayoutProps>) {
  const dispatch = useAppDispatch();
  const page = useAppSelector(selectProblemSubmissionsPage);
  const size = useAppSelector(selectProblemSubmissionsSize);
  const timestamp = useAppSelector(selectProblemSubmissionsTimestamp);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(
        ProblemSubmissionsEvents.loadSubmissionsRequested({
          problemId: problem.id,
          page,
          size,
          timestamp,
        })
      );
    }
  }, [dispatch, isAuthenticated, problem.id, page, size, timestamp]);

  return (
    <SidebarLayout breadcrumbs={[]} className="grid grid-cols-12 gap-4">
      <ProblemSubmissionsHeader problem={problem} className="col-span-12" />
      <ProblemSubmissions className="col-span-8" problem={problem} />
      <ProblemSubmissionsFilter className="col-span-4" />
    </SidebarLayout>
  );
}
