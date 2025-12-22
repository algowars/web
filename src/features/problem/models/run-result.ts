import { SubmissionStatus } from "./submission-status";

export interface RunResult {
  submissionId: string;
  status: SubmissionStatus;
}
