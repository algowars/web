import { create } from "zustand";
import { Language } from "../problems/models/language";
import { devtools, subscribeWithSelector } from "zustand/middleware";

type CreateProblemState = {
  title: string;
  question: string;
  tags: string[];
  availableLanguages: Language[];
};

type CreateProblemStoreActions = {
  changeTitle: (title: string) => void;
  changeQuestion: (question: string) => void;
  addTag: (tag: string) => void;
  removeTag: (index: number) => void;
  setAvailableLanguages: (languages: Language[]) => void;
};

type CreateProblemStore = CreateProblemState & CreateProblemStoreActions;

export const useCreateProblemStore = create<CreateProblemStore>()(
  subscribeWithSelector(
    devtools((set, get) => ({
      title: "",
      question: "",
      tags: [],
      availableLanguages: [],

      changeTitle: (title: string) => set({ title }),

      changeQuestion: (question: string) => set({ question }),

      addTag: (tag: string) =>
        set({ tags: [...get().tags, tag.replace(/\s+/g, "")] }),

      removeTag: (index: number) =>
        set({
          tags: get().tags.filter((_, i) => i !== index),
        }),

      setAvailableLanguages: (languages) =>
        set({ availableLanguages: languages }),
    }))
  )
);
