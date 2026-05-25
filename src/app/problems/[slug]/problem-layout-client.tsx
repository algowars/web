"use client";

import { accountStore } from "@/features/account/account-store";
import ProblemLayout from "@/features/problem/problem-layout";
import { Problem } from "@/features/problems/models/problem";

type ProblemLayoutClientProps = {
  problem: Problem;
};

export default function ProblemLayoutClient({
  problem,
}: ProblemLayoutClientProps) {
  const account = accountStore((state) => state.account);

  return <ProblemLayout problem={problem} isAuthenticated={!!account} />;
}
