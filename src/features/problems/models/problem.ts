import { Language } from "./language";

export interface Problem {
  id: string;
  title: string;
  slug: string;
  question?: string;
  difficulty: number;
  tags: string[];
  availableLanguages: Language[];
}
