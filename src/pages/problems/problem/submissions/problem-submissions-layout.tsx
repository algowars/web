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
    if (isAuthenticated && problem.slug) {
      dispatch(
        ProblemSubmissionsEvents.loadSubmissionsRequested({
          slug: problem.slug,
          page,
          size,
          timestamp,
        })
      );
    }
  }, [dispatch, isAuthenticated, problem.slug, page, size, timestamp]);

  return (
    <SidebarLayout breadcrumbs={[]}>
      <div className="px-2 md:px-4 pb-2 md:pb-4 grid grid-cols-12 gap-4">
        <ProblemSubmissionsHeader problem={problem} className="col-span-12" />
        <ProblemSubmissions className="col-span-8" problem={problem} />
        <ProblemSubmissionsFilter className="col-span-4" />
      </div>
    </SidebarLayout>
  );
}
