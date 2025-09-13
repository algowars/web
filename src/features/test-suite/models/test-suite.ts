import { TestSuiteType } from "./test-suite-type";
import { Testcase, TestCaseBase } from "./testcase";

export interface TestSuite {
  id: number;
  code: TestSuiteType;
  description: string;
  testcases: Testcase[];
}
