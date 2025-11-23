import { Problem } from "@/features/problems/models/problem";
import { ProblemSetup } from "@/features/problems/models/problem-setup";
import { LanguageVersion } from "@/features/problems/models/language";

import { create } from "zustand";

type ProblemEditorStore = {
  setup: ProblemSetup | null;
  problem: Problem | null;
  code: string;
  currentVersion: LanguageVersion | null;
  setSetup: (setup: ProblemSetup | null) => void;
  setProblem: (problem: Problem | null) => void;
  setCode: (code: string) => void;
  resetCode: () => void;
  setCurrentVersion: (version: LanguageVersion | null) => void;
};

export const problemEditorStore = create<ProblemEditorStore>((set, get) => ({
  setup: null,
  problem: null,
  code: "",
  currentVersion: null,

  setSetup: (setup) =>
    set(() => ({
      setup,
      code: setup?.initialCode ?? "",
      currentVersion:
        Array.isArray(get().problem?.availableLanguages) &&
        get().problem?.availableLanguages.length
          ? get().problem?.availableLanguages[0]?.versions[0]
          : null,
    })),

  setProblem: (problem) => set(() => ({ problem })),

  setCode: (code) => set({ code }),

  resetCode: () => {
    const setup = get().setup;
    set({ code: setup?.initialCode ?? "" });
  },

  setCurrentVersion: (version) => set({ currentVersion: version }),
}));

problemEditorStore.subscribe((state) => state.currentVersion, (currentVersion, oldVersion) => {
  console.log(`Current Version: ${currentVersion}, Old Version: ${oldVersion}`);
});