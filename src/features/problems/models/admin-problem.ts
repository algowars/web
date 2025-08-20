import { ProblemDifficulty } from "./problem-difficulty";
import { ProblemStatus } from "./problem-status";

export interface AdminProblem {
  id: string;
  title: string;
  slug: string;
  question?: string;
  difficulty: ProblemDifficulty;
  tags: string[];
  status: ProblemStatus;
  createdAt: string;
  updatedAt: string;
}
