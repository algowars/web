import { useEffect } from "react";
import { toast } from "sonner";
import { ProblemEvents } from "../state/problem-events";
import {
  selectProblemsError,
  selectProblemsPage,
  selectProblemsSize,
  selectProblemsTimestamp,
} from "../state/problem-slice";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";

/**
 * Triggers (and re-triggers on page/size change) the `loadProblemsRequested`
 * listener, and surfaces load errors as a toast. Shared by ProblemsLayout
 * and DashboardLayout so the two don't drift out of sync.
 */
export function useLoadProblems() {
  const dispatch = useAppDispatch();
  const page = useAppSelector(selectProblemsPage);
  const size = useAppSelector(selectProblemsSize);
  const timestamp = useAppSelector(selectProblemsTimestamp);
  const error = useAppSelector(selectProblemsError);

  // Generate the initial timestamp client-side, after mount, instead of at
  // module-load time — see the comment on `timestamp` in problem-slice.ts.
  useEffect(() => {
    if (typeof timestamp !== "string" || timestamp.trim() === "") {
      dispatch(ProblemEvents.setProblemsTimestamp(new Date().toISOString()));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

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
}
