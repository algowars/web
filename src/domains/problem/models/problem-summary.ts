export interface ProblemSummary {
  id: string;
  slug: string;
  title: string;
  difficulty: number;
  tags: string[];
  question?: string;
}
