import { Extension } from "@uiw/react-codemirror";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { devtools } from "zustand/middleware/devtools";

type SolutionEditorState = {
  code: string;
  languageId: number;
  extensions: Extension[];
};

type SolutionEditorActions = {
  setCode: (code: string) => void;
  changeLanguageId: (languageId: number) => void;
  addExtensions: (extensions: Extension[]) => void;
};

type SolutionEditorStore = SolutionEditorState & SolutionEditorActions;

export const useSolutionEditorStore = create<SolutionEditorStore>()(
  subscribeWithSelector(
    devtools((set) => ({
      code: "",
      languageId: 0,
      extensions: [],
      setCode: (code) => set({ code }),
      changeLanguageId: (languageId) => set({ languageId }),
      addExtensions: (extensions) =>
        set((state) => ({ extensions: [...state.extensions, ...extensions] })),
    }))
  )
);
