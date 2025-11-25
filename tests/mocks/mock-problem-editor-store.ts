import { vi } from "vitest";
import { Language } from "@/features/problems/models/language";
import { Problem } from "@/features/problems/models/problem";
import { ProblemSetup } from "@/features/problems/models/problem-setup";

const mockLanguages: Language[] = [
  { id: 1, name: "Python", versions: [{ id: 101, version: "3.11" }] },
  { id: 2, name: "JavaScript", versions: [{ id: 201, version: "ES2022" }] },
];

const mockProblem: Problem = {
  id: "p1",
  title: "Sample Problem",
  slug: "sample-problem",
  difficulty: { rating: 1200, name: "Easy" },
  tags: ["arrays"],
  availableLanguages: mockLanguages,
};

const mockSetup: ProblemSetup = {
  id: 1,
  defaultLanguageId: 1,
  defaultLanguageVersionId: 101,
  languageVersionId: 101,
  createdOn: Date.now(),
  createdBy: {
    id: "u1",
    username: "testuser123",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  version: 1,
  problem: mockProblem,
  initialCode: "print('Hello World')",
};

export const mockProblemStore = {
  setup: mockSetup,
  problem: mockProblem,
  code: mockSetup.initialCode,
  currentVersionId: 101,
  language: mockLanguages[0],
  languageVersion: mockLanguages[0].versions[0],
  availableLanguages: mockLanguages,
  setSetup: vi.fn(),
  setProblem: vi.fn(),
  changeCode: vi.fn(),
  resetCode: vi.fn(),
  changeCurrentVersion: vi.fn(),
  getLanguage: vi.fn(() => mockLanguages[0]),
  getLanguageVersion: vi.fn(() => mockLanguages[0].versions[0]),
  getAvailableLanguages: vi.fn(() => mockLanguages),
};

vi.mock("../../problem-editor-store", () => ({
  useProblemEditor: () => mockProblemStore,
}));
