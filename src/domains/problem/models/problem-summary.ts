export interface ProblemSummary {
  id: string;
  slug: string;
  title: string;
  difficultyTier: number;
  tags: string[];
  question?: string;
}
