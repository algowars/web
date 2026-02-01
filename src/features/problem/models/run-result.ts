import { SubmissionResultStatus } from "./submission-result-status";
import { SubmissionStatus } from "./submission-status";

export interface RunResult {
  submissionId: string;
  status: SubmissionStatus;
  testCases: RunResultTestCase[];
}

export interface RunResultTestCase {
  input: string;
  expectedOutput: string;
  status: SubmissionResultStatus;
}
