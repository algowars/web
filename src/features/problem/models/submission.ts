export interface Submission {
  id: string;
  problemSetupId: number;
  status: string;
  language: string;
  languageVersion: string;
  runtime: string;
  memory: string;
  code: string;
  createdOn: string;
  completedAt?: string | null;
  createdBy?: {
    id: string;
    username: string;
    imageUrl?: string | null;
  } | null;
}
