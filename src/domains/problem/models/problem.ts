import { ProgrammingLanguage } from "@/domains/language/models/programming-language";

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: number;
  tags: string[];
  question?: string;
  availableLanguages?: ProgrammingLanguage[];
}
