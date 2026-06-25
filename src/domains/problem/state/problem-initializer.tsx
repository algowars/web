"use client";

import { useEffect } from "react";
import { useGetProblems } from "../api/get-problems";
import { useProblemsStore } from "./problems-store";
import { toast } from "sonner";

export default function ProblemInitializer() {
  const page = useProblemsStore((s) => s.page);
  const size = useProblemsStore((s) => s.size);
  const timestamp = useProblemsStore((s) => s.timestamp);
  const setProblems = useProblemsStore((s) => s.setProblems);
  const setIsLoading = useProblemsStore((s) => s.setIsLoading);
  const {
    data: problems,
    isPending,
    error,
    isError,
  } = useGetProblems({
    page,
    size,
    timestamp,
  });

  useEffect(() => {
    if (problems?.results) {
      setProblems(problems.results);
    }
  }, [problems, setProblems]);

  useEffect(() => {
    setIsLoading(isPending);
  }, [isPending, setIsLoading]);

  useEffect(() => {
    if (isError) {
      toast.error("Error loading problems", { description: error.message });
    }
  }, [error, isError]);

  return null;
}
