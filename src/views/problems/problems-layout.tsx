"use client";

import ProblemTable from "@/domains/problem/tables/problem-table";
import { ProblemEvents } from "@/domains/problem/state/problem-events";
import {
  selectProblemsError,
  selectProblemsPage,
  selectProblemsSize,
  selectProblemsTimestamp,
} from "@/domains/problem/state/problem-slice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import SidebarLayout from "@/shared/layouts/sidebar-layout/sidebar-layout";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ProblemsLayout() {
  const dispatch = useAppDispatch();
  const page = useAppSelector(selectProblemsPage);
  const size = useAppSelector(selectProblemsSize);
  const timestamp = useAppSelector(selectProblemsTimestamp);
  const error = useAppSelector(selectProblemsError);

  useEffect(() => {
    if (typeof timestamp !== "string" || timestamp.trim() === "") {
      return;
    }

    dispatch(
      ProblemEvents.loadProblemsRequested({
        page,
        size,
        timestamp,
      })
    );
  }, [dispatch, page, size, timestamp]);

  useEffect(() => {
    if (error) {
      toast.error("Error loading problems", { description: error });
    }
  }, [error]);

  return (
    <SidebarLayout breadcrumbs={[]}>
      <div className="px-2 md:px-4 pb-2 md:pb-4 grid grid-cols-12 gap-4">
        <Card className="col-span-12">
          <CardHeader>
            <CardTitle>Problems</CardTitle>
          </CardHeader>
          <CardContent>
            <ProblemTable />
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
