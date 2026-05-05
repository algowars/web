"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect } from "react";
import {
  useSuspenseProblemSolutionsWithStore,
  useSuspenseProblemSubmissionsWithStore,
} from "./problem-submissions-store";
import { useProblemSubmissionsStore } from "./problem-submissions-store";
import SubmissionCard from "./submission-card";
import InfiniteScroll from "react-infinite-scroll-component";

type ProblemSubmissionsProps = React.ComponentProps<typeof Card>;
type ProblemSubmissionItem = React.ComponentProps<
  typeof SubmissionCard
>["submission"];

export function ProblemSubmissionsEmpty(props: ProblemSubmissionsProps) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Submissions</CardTitle>
        <CardDescription>0 submissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          No accepted solutions yet.
        </div>
      </CardContent>
    </Card>
  );
}

function ProblemSubmissionsList({
  submissions,
  hasMore,
  onLoadMore,
  isLoading,
  total,
  label,
  ...props
}: ProblemSubmissionsProps & {
  submissions: ProblemSubmissionItem[];
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading: boolean;
  total: number;
  label: string;
}) {
  if (submissions.length === 0) {
    return <ProblemSubmissionsEmpty {...props} />;
  }

  return (
    <Card {...props}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {label === "submissions" ? "Submissions" : "Solutions"}
        </CardTitle>
        <CardDescription>
          {total} {label}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InfiniteScroll
          dataLength={submissions.length}
          next={onLoadMore}
          hasMore={hasMore}
          loader={
            <div className="text-center py-4 text-muted-foreground">
              Loading more submissions...
            </div>
          }
          endMessage={
            submissions.length > 0 && !hasMore ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No more submissions to load
              </div>
            ) : null
          }
        >
          <div className="grid gap-4">
            {submissions.map((submission) => (
              <SubmissionCard key={submission.id} submission={submission} />
            ))}
          </div>
        </InfiniteScroll>
      </CardContent>
    </Card>
  );
}

export default function ProblemSubmissions(props: ProblemSubmissionsProps) {
  const { data, isLoading } = useSuspenseProblemSubmissionsWithStore();
  const submissions = useProblemSubmissionsStore((s) => s.submissions);
  const page = useProblemSubmissionsStore((s) => s.page);
  const total = useProblemSubmissionsStore((s) => s.total);
  const hasMore = useProblemSubmissionsStore((s) => s.hasMore);
  const setSubmissions = useProblemSubmissionsStore((s) => s.setSubmissions);
  const addSubmissions = useProblemSubmissionsStore((s) => s.addSubmissions);
  const incrementPage = useProblemSubmissionsStore((s) => s.incrementPage);
  const setTotal = useProblemSubmissionsStore((s) => s.setTotal);
  const setHasMore = useProblemSubmissionsStore((s) => s.setHasMore);

  useEffect(() => {
    if (data) {
      if (page === 1) {
        setSubmissions(data.results);
      } else {
        addSubmissions(data.results);
      }
      setTotal(data.total);
      setHasMore(data.hasMore);
    }
  }, [data, page, setSubmissions, addSubmissions, setTotal, setHasMore]);

  const handleLoadMore = () => {
    incrementPage();
  };

  return (
    <ProblemSubmissionsList
      submissions={submissions}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      isLoading={isLoading}
      total={total}
      label="submissions"
      {...props}
    />
  );
}

export function ProblemSolutions(props: ProblemSubmissionsProps) {
  const { data, isLoading } = useSuspenseProblemSolutionsWithStore();
  const submissions = useProblemSubmissionsStore((s) => s.submissions);
  const page = useProblemSubmissionsStore((s) => s.page);
  const total = useProblemSubmissionsStore((s) => s.total);
  const hasMore = useProblemSubmissionsStore((s) => s.hasMore);
  const setSubmissions = useProblemSubmissionsStore((s) => s.setSubmissions);
  const addSubmissions = useProblemSubmissionsStore((s) => s.addSubmissions);
  const incrementPage = useProblemSubmissionsStore((s) => s.incrementPage);
  const setTotal = useProblemSubmissionsStore((s) => s.setTotal);
  const setHasMore = useProblemSubmissionsStore((s) => s.setHasMore);

  useEffect(() => {
    if (data) {
      if (page === 1) {
        setSubmissions(data.results);
      } else {
        addSubmissions(data.results);
      }
      setTotal(data.total);
      setHasMore(data.hasMore);
    }
  }, [data, page, setSubmissions, addSubmissions, setTotal, setHasMore]);

  const handleLoadMore = () => {
    incrementPage();
  };

  return (
    <ProblemSubmissionsList
      submissions={submissions}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      isLoading={isLoading}
      total={total}
      label="solutions"
      {...props}
    />
  );
}
