import { CreateProblemSetup } from "./create-problem-setup-model";

export interface CreateProblemModel {
  title: string;
  question: string;
  tags: string[];
  estimatedDifficulty: number;
  setups: CreateProblemSetup[];
}
