export interface CreateProblemTestSuiteModel {
  type: "public" | "private";
  testCases: CreateProblemTestSuiteTestCaseModel[];
}

export interface CreateProblemTestSuiteTestCaseModel {
  input: string;
  expectedOutput: string;
}
