import type { User } from "@/domains/user/models/user";

export interface ProblemSubmission {
  sourceCode: string;
  user: User;
  status: string;
  memoryUsage?: number;
  executionTime?: number;
  language: ProblemSubmissionLanguage;
}

export interface ProblemSubmissionLanguage {
  id: string;
  name: string;
  version: string;
}

export interface ProblemSubmissionUser {
  username: string;
  profilePictureUrl: string;
}
