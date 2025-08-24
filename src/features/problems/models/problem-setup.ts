import { Account } from "@/features/auth/models/account.model";
import { Problem } from "./problem";
import { TestSuite } from "./test-suite";
import { Language } from "./language";

export interface ProblemSetup {
  id: number;
  defaultLanguageId: number;
  defaultLanguageVersionId: number;
  createdOn: number;
  createdBy: Account;
  version: number;
  problem: Problem;
  initialCode: string;
  testSuite: TestSuite;
  languages: Language[];
}
