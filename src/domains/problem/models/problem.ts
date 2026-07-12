import { ProgrammingLanguage } from "@/domains/language/models/programming-language";

export interface ProblemAuthor {
  username: string;
  imageUrl?: string | null;
}

export interface PublicTestCaseInput {
  value: string;
  valueType: string;
}

export interface PublicTestCaseExpectedOutput {
  value: string;
  valueType: string;
}

export interface PublicTestCase {
  name: string;
  description?: string | null;
  inputs: PublicTestCaseInput[];
  expectedOutputs: PublicTestCaseExpectedOutput[];
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficultyTier: number;
  question: string;
  availableLanguages: ProgrammingLanguage[];
  publicTestCases: PublicTestCase[];
  author?: ProblemAuthor | null;
  tags?: string[];
}
