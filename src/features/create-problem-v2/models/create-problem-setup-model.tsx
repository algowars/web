import { CreateProblemTestSuiteModel } from "./create-problem-test-suite-model";

export interface CreateProblemSetup {
  languageVersionIds: number[];
  initialCode: string;
  solution: string;
  testSuites: CreateProblemTestSuiteModel[];
}
