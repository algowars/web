import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

type ProblemSubmissionsSkeletonProps = React.ComponentProps<typeof Card>;

export default function ProblemSubmissionsSkeleton(
  props: ProblemSubmissionsSkeletonProps
) {
  return (
    <Card {...props}>
      <CardHeader>
        <Skeleton className="h-9 w-64 rounded-md" />
      </CardHeader>
      <CardContent className="grid gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full rounded-md" />
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
