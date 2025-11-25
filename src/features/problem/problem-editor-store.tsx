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
};

type ProblemEditorStore = ProblemEditorState & {
  actions: ProblemEditorActions;
};

export const useProblemEditorStore = create<ProblemEditorStore>()(
  subscribeWithSelector(
    devtools((set, get) => ({
      setup: null,
      problem: null,
      code: "",
      currentVersionId: null,

      actions: {
        setSetup: (setup) => set({ setup, code: setup?.initialCode }),

        setProblem: (problem) =>
          set({
            problem,
            currentVersionId:
              problem?.availableLanguages[0]?.versions[0]?.id ?? null,
          }),

        changeCode: (code) => set({ code }),

        resetCode: () => set({ code: get().setup?.initialCode ?? "" }),

        changeCurrentVersion: (version: LanguageVersion) =>
          set({ currentVersionId: version?.id }),

        getLanguage: () =>
          get().problem?.availableLanguages.find((l) =>
            l.versions.some((v) => v.id === get().currentVersionId)
          ) ?? null,

        getLanguageVersion: () =>
          get()
            .problem?.availableLanguages.flatMap((l) => l.versions)
            .find((v) => v.id === get().currentVersionId) ?? null,

        getAvailableLanguages: () => get().problem?.availableLanguages ?? [],
      },
    }))
  )
);

export function useProblemEditor() {
  const actions = useProblemEditorStore((s) => s.actions);

  const setup = useProblemEditorStore((s) => s.setup);
  const problem = useProblemEditorStore((s) => s.problem);
  const code = useProblemEditorStore((s) => s.code);
  const currentVersionId = useProblemEditorStore((s) => s.currentVersionId);

  const language = useProblemEditorStore((s) => s.actions.getLanguage());
  const languageVersion = useProblemEditorStore((s) =>
    s.actions.getLanguageVersion()
  );
  const availableLanguages = useProblemEditorStore((s) =>
    s.actions.getAvailableLanguages()
  );

  return {
    setup,
    problem,
    code,
    currentVersionId,

    language,
    languageVersion,
    availableLanguages,

    ...actions,
  };
}
