import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { InfinitePaginatedList } from "@/shared/pagination/pagination-list";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import { ComponentProps, useEffect } from "react";
import {
  selectProblemSubmissions,
  selectHasMoreSubmissions,
  selectIsProblemSubmissionsLoading,
} from "../state/problem-submissions-slice";

import ProblemSubmissionsCard from "./problem-submissions-card";
import { ProblemSubmissionsEvents } from "../state/problem-submissions-events";
import { Problem } from "../../models/problem";

type ProblemSubmissionsProps = {
  problem: Problem;
} & ComponentProps<"div">;

export default function ProblemSubmissions({
  problem,
  ...props
}: Readonly<ProblemSubmissionsProps>) {
  const submissions = useAppSelector(selectProblemSubmissions);
  const hasMore = useAppSelector(selectHasMoreSubmissions);
  const isLoading = useAppSelector(selectIsProblemSubmissionsLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      ProblemSubmissionsEvents.loadSubmissionsRequested({
        slug: problem.slug,
        page: 1,
        size: 10,
        timestamp: new Date().toISOString(),
      })
    );
  }, [dispatch, problem.slug]);

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <InfinitePaginatedList
          items={submissions}
          hasMore={hasMore}
          isFetching={isLoading}
          emptyComponent={
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground text-sm">
                No submissions found.
              </p>
            </div>
          }
          onNext={() =>
            dispatch(
              ProblemSubmissionsEvents.loadMoreSubmissionsRequested({
                slug: problem.slug,
              })
            )
          }
          renderItem={(item) => <ProblemSubmissionsCard submission={item} />}
          getKey={(item) => item.id}
        />
      </CardContent>
    </Card>
  );
}
