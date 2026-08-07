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

export function useLoadProblems() {
  const dispatch = useAppDispatch();
  const page = useAppSelector(selectProblemsPage);
  const size = useAppSelector(selectProblemsSize);
  const timestamp = useAppSelector(selectProblemsTimestamp);
  const error = useAppSelector(selectProblemsError);

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
