import { create } from "zustand";
import { Language, LanguageVersion } from "../problems/models/language";
import { Problem } from "../problems/models/problem";
import { ProblemSetup } from "../problems/models/problem-setup";
import { devtools, subscribeWithSelector } from "zustand/middleware";

type ProblemEditorState = {
  setup: ProblemSetup | null;
  problem: Problem | null;
  code: string;
  currentVersionId: number | null;
};

type ProblemEditorActions = {
  setSetup: (setup: ProblemSetup | null | undefined) => void;
  setProblem: (problem: Problem | null) => void;
  changeCode: (code: string) => void;
  resetCode: () => void;
  changeCurrentVersion: (version: LanguageVersion | null | undefined) => void;
  getLanguage: () => Language | null;
  getLanguageVersion: () => LanguageVersion | null;
  getAvailableLanguages: () => Language[];
  findVersionById: (id: number) => LanguageVersion | null;
};

type ProblemEditorStore = ProblemEditorState & ProblemEditorActions;

export const useProblemEditorStore = create<ProblemEditorStore>()(
  subscribeWithSelector(
    devtools((set, get) => ({
      setup: null,
      problem: null,
      code: "",
      currentVersionId: null,

      setSetup: (setup) => set({ setup, code: setup?.initialCode }),

      setProblem: (problem) =>
        set({
          problem,
          currentVersionId:
            problem?.availableLanguages[0]?.versions[0]?.id ?? null,
        }),

      changeCode: (code) => set({ code }),

      resetCode: () => set({ code: get().setup?.initialCode ?? "" }),

      changeCurrentVersion: (version) =>
        set({ currentVersionId: version?.id ?? null }),

      getLanguage: () =>
        get().problem?.availableLanguages.find((l) =>
          l.versions.some((v) => v.id === get().currentVersionId)
        ) ?? null,

      getLanguageVersion: () =>
        get()
          .problem?.availableLanguages.flatMap((l) => l.versions)
          .find((v) => v.id === get().currentVersionId) ?? null,

      getAvailableLanguages: () => get().problem?.availableLanguages ?? [],

      findVersionById: (id: number) =>
        get()
          .problem?.availableLanguages.flatMap((l) => l.versions)
          .find((v) => v.id === id) ?? null,
    }))
  )
);
