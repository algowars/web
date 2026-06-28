"use client";

import { useEffect } from "react";
import ProblemLoading from "@/app/problems/[slug]/loading";
import ProblemNotFound from "@/app/problems/[slug]/not-found";
import { useGetProblemBySlugQuery } from "@/domains/problem/api/problem-api";
import { ProblemEvents } from "@/domains/problem/state/problem-events";
import { useAppDispatch } from "@/shared/state/hooks";
import ProblemLayout from "./problem-layout";

type ProblemPageClientProps = {
  slug: string;
};

export default function ProblemPageClient({ slug }: ProblemPageClientProps) {
  const dispatch = useAppDispatch();
  const { data, isLoading, isFetching, isError } = useGetProblemBySlugQuery({
    slug,
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    dispatch(ProblemEvents.initializeProblem(data));
  }, [dispatch, data]);

  if (isLoading || isFetching) {
    return <ProblemLoading />;
  }

  if (isError || !data) {
    return <ProblemNotFound />;
  }

  return <ProblemLayout problem={data} />;
}
