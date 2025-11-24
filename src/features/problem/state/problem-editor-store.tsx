import { Language, LanguageVersion } from "@/features/problems/models/language";
import { Problem } from "@/features/problems/models/problem";
import { ProblemSetup } from "@/features/problems/models/problem-setup";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

type ProblemEditorState = {
  setup: ProblemSetup | null;
  problem: Problem | null;
  code: string;
  currentVersion: LanguageVersion | null;
};

type ProblemEditorActions = {
  setSetup: (setup: ProblemSetup | null | undefined) => void;
  setProblem: (problem: Problem | null) => void;
  setCode: (code: string) => void;
  resetCode: () => void;
  setCurrentVersion: (version: LanguageVersion | null) => void;
  getResolvedVersion: () => LanguageVersion | null;
  getResolveLanguage: () => Language | null;
};

type ProblemEditorStore = ProblemEditorState & ProblemEditorActions;

export const useProblemEditorStore = create<ProblemEditorStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      setup: null,
      problem: null,
      code: "",
      currentVersion: null,

      setSetup: (setup) =>
        set({
          setup,
          code: setup?.initialCode ?? "",
          currentVersion:
            get()
              .problem?.availableLanguages.reduce(
                (prev: LanguageVersion[], curr) => [...prev, ...curr.versions],
                []
              )
              .find((v) => v.id === setup?.languageVersionId) ?? null,
        }),

      setProblem: (problem) => set({ problem }),

      setCode: (code) => set({ code }),

      resetCode: () => {
        const setup = get().setup;
        set({ code: setup?.initialCode ?? "" });
      },

      setCurrentVersion: (version) => set({ currentVersion: version }),

      getResolvedVersion: () => {
        const { problem, currentVersion } = get();

        if (!problem || !currentVersion) {
          return null;
        }

        for (const language of problem.availableLanguages ?? []) {
          const found = language.versions.find(
            (v) => v.id === currentVersion.id
          );
          if (found) return found;
        }
        return null;
      },

      getResolveLanguage: () => {
        const { problem, currentVersion } = get();

        if (!problem || !currentVersion) {
          return null;
        }

        for (const language of problem.availableLanguages ?? []) {
          if (language.versions.find((v) => v.id === currentVersion.id)) {
            return language;
          }
        }

        return null;
      },
    }))
  )
);
