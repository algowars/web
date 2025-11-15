import { Language } from "./language";
import { ProblemDifficulty } from "./problem-difficulty";

export interface Problem {
  id: string;
  title: string;
  slug: string;
  question?: string;
  difficulty: ProblemDifficulty;
  tags: string[];
  availableLanguages: Language[];
}
