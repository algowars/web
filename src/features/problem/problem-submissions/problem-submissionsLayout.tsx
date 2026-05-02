"use client";

import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { Problem } from "@/features/problems/models/problem";
import { routerConfig } from "@/router-config";
import { useEffect, useMemo } from "react";
import { useProblemSubmissionsStore } from "./problem-submissions-store";
import ProblemSubmissionsHeader from "./problem-submissions-header";
import ProblemSubmissions from "./problem-submissions";
import { useProblemSubmissions } from "@/features/problem/api/get-problem-submissions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0";

type ProblemSubmissionsLayoutProps = {
  problem: Problem;
};

export default function ProblemSubmissionsLayout({
  problem,
}: ProblemSubmissionsLayoutProps) {
  const { user } = useUser();
  const setProblem = useProblemSubmissionsStore((s) => s.setProblem);
  const setSubmissions = useProblemSubmissionsStore((s) => s.setSubmissions);
  const setCurrentUserId = useProblemSubmissionsStore((s) => s.setCurrentUserId);
  const filterMode = useProblemSubmissionsStore((s) => s.filterMode);

  // Extract user ID from Auth0 subject claim
  const userId = useMemo(() => {
    if (user?.sub && filterMode === "mine") {
      // Extract the user ID part after the pipe
      return user.sub.split("|").pop();
    }
    return undefined;
  }, [user?.sub, filterMode]);

  const { data, isLoading, isError, error } = useProblemSubmissions({
    problemId: problem?.id,
    userId,
    queryConfig: {
      enabled: !!problem?.id,
    },
  });

  useEffect(() => {
    setProblem(problem);
  }, [problem, setProblem]);

  useEffect(() => {
    if (user?.sub) {
      setCurrentUserId(user.sub);
    }
  }, [user?.sub, setCurrentUserId]);

  useEffect(() => {
    setSubmissions(data?.results ?? []);
  }, [data?.results, setSubmissions]);

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
      <div className="grid grid-cols-12 gap-3">
        <ProblemSubmissionsHeader className="col-span-12" />
        {isError && (
          <Alert variant="destructive" className="col-span-12">
            <AlertTriangle />
            <AlertTitle>Error loading submissions</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "An unexpected error occurred while loading submissions."}
            </AlertDescription>
          </Alert>
        )}
        <ProblemSubmissions isLoading={isLoading} className="col-span-9" />
      </div>
    </SidebarLayout>
  );
}
