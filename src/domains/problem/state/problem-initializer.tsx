"use client";

import { useEffect } from "react";
import { Problem } from "../models/problem";
import { useProblemStore } from "./problem-store";

type ProblemInitializerProps = {
  problem: Problem | null;
};

export default function ProblemInitializer({
  problem,
}: ProblemInitializerProps) {
  const initProblem = useProblemStore((s) => s.initProblem);

  useEffect(() => {
    if (problem) {
      initProblem(problem);
    }
  }, [problem, initProblem]);

  return null;
}
