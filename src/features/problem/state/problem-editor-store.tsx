import { LanguageVersion } from "@/features/problems/models/language";
import { Problem } from "@/features/problems/models/problem";
import { ProblemSetup } from "@/features/problems/models/problem-setup"
import { create } from "zustand";
import { subscribeWithSelector } from 'zustand/middleware'

type ProblemEditorState = {
    setup: ProblemSetup | null;
    problem: Problem | null;
    code: string;
    currentVersion: LanguageVersion | null;
}

type ProblemEditorActions = {
    setSetup: (setup: ProblemSetup | null) => void;
    setProblem: (problem: Problem | null) => void;
    setCode: (code: string) => void;
    resetCode: () => void;
    setCurrentVersion: (version: LanguageVersion | null) => void;
}

type ProblemEditorStore = ProblemEditorState & ProblemEditorActions;

const problemEditorStore = create<SubscribeWithSelector<ProblemEditorStore>(
  subscribeWithSelector((set, get) => ({
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
      set({ code: setup?.initialCode ?? "" }); // `setup?.initialCode ?? ""` will be safe
    },

    setCurrentVersion: (version) => set({ currentVersion: version }),
  }))
);