import { Account } from "@/features/auth/models/account.model";
import { SubmissionStatus } from "./submission-status";

export interface ProblemSubmission {
  id: string;
  code: string;
  status: SubmissionStatus;
  language: string;
  languageVersion: string;
  runtimeMs: number;
  memoryKb: number;
  createdOn: Date;
  createdBy: Account;
}
