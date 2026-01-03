import { AdminProblem } from "@/features/problems/models/admin-problem";
import { TestSuite } from "@/features/test-suite/models/test-suite";

export interface AdminProblemAggregate {
  problem: AdminProblem;
  testSuites: TestSuite[];
}
