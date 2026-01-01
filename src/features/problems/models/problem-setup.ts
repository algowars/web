import { Account } from "@/features/auth/models/account.model";
import { Problem } from "./problem";
import { TestSuite } from "@/features/test-suite/models/test-suite";

export interface ProblemSetup {
  id: number;
  defaultLanguageId: number;
  defaultLanguageVersionId: number;
  languageVersionId: number;
  createdOn: number;
  createdBy: Account;
  version: number;
  problem: Problem;
  initialCode: string;
  testSuites: TestSuite[];
}
