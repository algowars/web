import { Account } from "@/features/auth/models/account.model";
import { ProblemStatus } from "./problem-status";
import { Language } from "./language";

export interface AdminProblem {
  id: string;
  title: string;
  slug: string;
  question?: string;
  difficulty: number;
  tags: string[];
  status: ProblemStatus;
  createdOn: Date;
  lastModifiedOn: Date | null;
  availableLanguages: Language[];
  createdBy: Account;
  deletedOn: Date | null;
  version: number;
}
