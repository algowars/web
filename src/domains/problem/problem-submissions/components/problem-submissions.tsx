import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { InfinitePaginatedList } from "@/shared/pagination/pagination-list";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import { cn } from "@/shared/lib/utils";
import { ComponentProps, useEffect } from "react";
import {
  selectProblemSubmissions,
  selectHasMoreSubmissions,
  selectIsProblemSubmissionsLoading,
  selectIsLoadingMoreSubmissions,
} from "../state/problem-submissions-slice";

import ProblemSubmissionsCard from "./problem-submissions-card";
import { ProblemSubmissionsEvents } from "../state/problem-submissions-events";
import { Problem } from "../../models/problem";

type ProblemSubmissionsProps = {
  problem: Problem;
} & ComponentProps<"div">;

export default function ProblemSubmissions({
  problem,
  className,
  ...props
}: Readonly<ProblemSubmissionsProps>) {
  const submissions = useAppSelector(selectProblemSubmissions);
  const page = useAppSelector((state) => state.problemSubmissions.page);
  const size = useAppSelector((state) => state.problemSubmissions.size);
  const timestamp = useAppSelector(
    (state) => state.problemSubmissions.timestamp
  );
  const totalPages = useAppSelector(
    (state) => state.problemSubmissions.totalPages
  );
  const hasMore = useAppSelector(selectHasMoreSubmissions);
  const isLoading = useAppSelector(selectIsProblemSubmissionsLoading);
  const isLoadingMore = useAppSelector(selectIsLoadingMoreSubmissions);
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
    <Card className={cn("h-fit", className)} {...props}>
      <CardHeader>
        <CardTitle>Submissionss</CardTitle>
        <p>Has More: {hasMore.toString()}</p>
        <p>Page: {page}</p>
        <p>Size: {size}</p>
        <p>Timestamp: {timestamp}</p>
        <p>Total Pages: {totalPages}</p>
      </CardHeader>
      <CardContent>
        <InfinitePaginatedList
          items={submissions}
          hasMore={hasMore}
          isFetching={isLoading || isLoadingMore}
          scrollableTarget="sidebar-layout-content"
          emptyComponent={
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground text-sm">
                No submissions found.
              </p>
            </div>
          }
          onNext={() => {
            console.log("Loading more submissions for problem:", problem.slug);
            dispatch(
              ProblemSubmissionsEvents.loadMoreSubmissionsRequested({
                slug: problem.slug,
              })
            );
          }}
          renderItem={(item) => <ProblemSubmissionsCard submission={item} />}
          getKey={(item) => item.id}
        />
      </CardContent>
    </Card>
  );
}
