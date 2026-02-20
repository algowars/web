import { Problem } from "@/features/problems/models/problem";
import { Submission } from "./submission";

export interface ProblemSubmission {
  problem: Problem;
  submissions: Submission[];
}
