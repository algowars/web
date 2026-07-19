export interface ProblemSummary {
  id: string;
  slug: string;
  title: string;
  difficultyTier: string;
  tags: string[];
  question?: string;
}
