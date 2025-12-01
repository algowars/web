import { create } from "zustand";
import { Language } from "../problems/models/language";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { SerializedEditorState } from "lexical";
import { CreateProblemSetup } from "./models/create-problem-setup-model";

type CreateProblemState = {
  title: string;
  questionState: SerializedEditorState;
  tags: string[];
  availableLanguages: Language[];
  difficulty: number;
  setups: CreateProblemSetup[];
};

type CreateProblemStoreActions = {
  changeTitle: (title: string) => void;
  changeQuestion: (questionState: SerializedEditorState) => void;
  addTag: (tag: string) => void;
  removeTag: (index: number) => void;
  setAvailableLanguages: (languages: Language[]) => void;
  changeDifficulty: (difficulty: number) => void;
  addSetup: (setup: CreateProblemSetup) => void;
  removeSetup: (index: number) => void;
};

type CreateProblemStore = CreateProblemState & CreateProblemStoreActions;

export const useCreateProblemStore = create<CreateProblemStore>()(
  subscribeWithSelector(
    devtools((set, get) => ({
      title: "",
      difficulty: 1500,
      questionState: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "",
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "paragraph",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      },
      tags: [],
      availableLanguages: [],
      setups: [],

      changeTitle: (title) => set({ title }),

      changeQuestion: (questionState) => set({ questionState }),

      addTag: (tag) => set({ tags: [...get().tags, tag.replace(/\s+/g, "")] }),

      removeTag: (index) =>
        set({
          tags: get().tags.filter((_, i) => i !== index),
        }),

      setAvailableLanguages: (languages) =>
        set({ availableLanguages: languages }),

      changeDifficulty: (difficulty) => set({ difficulty }),

      addSetup: (setup) => set({ setups: [...get().setups, setup] }),

      removeSetup: (index) =>
        set({
          setups: get().setups.filter((_, i) => i !== index),
        }),
    }))
  )
);
