"use client";

import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { Problem } from "@/features/problems/models/problem";
import { routerConfig } from "@/router-config";
import ProblemSubmissionsHeader from "./problem-submissions-header";
import ProblemSubmissions, {
  ProblemSolutions,
  ProblemSubmissionsEmpty,
} from "./problem-submissions";
import ProblemSubmissionsAlert from "./problem-submissions-alert";
import ProblemSubmissionsSkeleton from "./problem-submissions-skeleton";
import { useProblemSubmissionsStore } from "./problem-submissions-store";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ProblemSubmissionsFilter from "./problem-submissions-filter";
import { ProblemSubmissionsOptions } from "./problem-submissions-options";
import AuthenticationGuard from "@/features/auth/guards/authentication-guard";
import ProblemSubmissionsUnauthenticatedCard from "./problem-submissions-unauthenticated-card";
import { useUser } from "@auth0/nextjs-auth0";

type ProblemSubmissionsLayoutProps = {
  problem: Problem;
};

export default function ProblemSubmissionsLayout({
  problem,
}: ProblemSubmissionsLayoutProps) {
  const initProblem = useProblemSubmissionsStore((s) => s.initProblem);
  initProblem(problem);
  const { user } = useUser();
  const filterOption = useProblemSubmissionsStore((s) => s.filterOption);
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
        <ErrorBoundary
          FallbackComponent={({ error }) => (
            <>
              <ProblemSubmissionsAlert error={error} className="col-span-12" />
              <ProblemSubmissionsEmpty className="col-span-9" />
            </>
          )}
        >
          <Suspense
            fallback={<ProblemSubmissionsSkeleton className="col-span-9" />}
          >
            <AuthenticationGuard
              fallbackComponent={
                <ProblemSubmissionsUnauthenticatedCard className="col-span-9" />
              }
              loadingComponent={
                <ProblemSubmissionsSkeleton className="col-span-9" />
              }
            >
              {filterOption === ProblemSubmissionsOptions.ALL_SOLUTIONS ? (
                <ProblemSolutions className="col-span-9" />
              ) : (
                <ProblemSubmissions className="col-span-9" />
              )}
            </AuthenticationGuard>
          </Suspense>
        </ErrorBoundary>
        <ProblemSubmissionsFilter
          className="col-span-3 self-start"
          isDisabled={!user}
        />
      </div>
    </SidebarLayout>
  );
}
