import { create } from "zustand";
import { Language, LanguageVersion } from "../problems/models/language";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { SerializedEditorState } from "lexical";
import { CreateProblemSetup } from "./models/create-problem-setup-model";
import {
  CreateProblemTestSuiteModel,
  CreateProblemTestSuiteTestCaseModel,
} from "./models/create-problem-test-suite-model";
import { CreateProblemModel } from "./models/create-problem-model";
import { lexicalToMarkdown } from "@/lib/lexical";

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
  getLanguageByVersionId: (versionId: number) => Language | null;
  getLanguageVersionById: (versionId: number) => LanguageVersion | null;
  getLanguagesByVersionIds: (versionIds: number[]) => Language[];
  getLanguageVersionsByIds: (versionIds: number[]) => LanguageVersion[];
  changeSetupInitialCode: (index: number, initialCode: string) => void;
  changeSetupSolutionCode: (index: number, solutionCode: string) => void;
  addSetupTestSuite: (testSuite: CreateProblemTestSuiteModel) => void;
  removeSetupTestSuite: (index: number) => void;
  changeSetupTestSuite: (
    index: number,
    testSuite: CreateProblemTestSuiteModel
  ) => void;
  getTestSuitesBySetupIndex: (index: number) => CreateProblemTestSuiteModel[];
  addTestCaseToSetupTestSuite: (
    setupIndex: number,
    testSuiteIndex: number,
    testCase: CreateProblemTestSuiteTestCaseModel
  ) => void;
  getTestCasesBySetupTestSuiteIndex: (
    setupIndex: number,
    testSuiteIndex: number
  ) => CreateProblemTestSuiteTestCaseModel[];
  updateSetupTestCase: (
    setupIndex: number,
    testSuiteIndex: number,
    testCaseIndex: number,
    testCase: CreateProblemTestSuiteTestCaseModel
  ) => void;
  removeTestCaseToSetupTestSuite: (
    setupIndex: number,
    testSuiteIndex: number,
    testCaseIndex: number
  ) => void;
  createProblem: () => CreateProblemModel;
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

      addSetup: (setup) => {
        const existing = get().setups;

        const isDuplicate = setup.languageVersionIds.some((id) =>
          existing.some((s) => s.languageVersionIds.includes(id))
        );

        if (isDuplicate) {
          return;
        }

        set({ setups: [...existing, setup] });
      },

      removeSetup: (index) =>
        set({
          setups: get().setups.filter((_, i) => i !== index),
        }),

      getLanguageByVersionId: (versionId) =>
        get().availableLanguages.find((lang) =>
          lang.versions.some((v) => v.id === versionId)
        ),

      getLanguageVersionById: (versionId) =>
        get()
          .availableLanguages.flatMap((l) => l.versions)
          .find((v) => v.id === versionId),

      getLanguagesByVersionIds: (versionIds) =>
        get().availableLanguages.filter((lang) =>
          lang.versions.some((v) => versionIds.includes(v.id))
        ),

      getLanguageVersionsByIds: (versionIds) =>
        get()
          .availableLanguages.flatMap((l) => l.versions)
          .filter((v) => versionIds.includes(v.id)),

      changeSetupInitialCode: (index, initialCode) =>
        set({
          setups: get().setups.map((setup, i) =>
            i === index ? { ...setup, initialCode } : setup
          ),
        }),

      changeSetupSolutionCode: (index, solutionCode) =>
        set({
          setups: get().setups.map((setup, i) =>
            i === index ? { ...setup, solutionCode } : setup
          ),
        }),

      addSetupTestSuite: (testSuite) =>
        set({
          setups: get().setups.map((setup) => ({
            ...setup,
            testSuites: [...(setup.testSuites ?? []), testSuite],
          })),
        }),

      removeSetupTestSuite: (index) =>
        set({
          setups: get().setups.map((setup) => ({
            ...setup,
            testSuites: (setup.testSuites ?? []).filter((_, i) => i !== index),
          })),
        }),

      changeSetupTestSuite: (index, testSuite) =>
        set({
          setups: get().setups.map((setup) => ({
            ...setup,
            testSuites: (setup.testSuites ?? []).map((ts, i) =>
              i === index ? testSuite : ts
            ),
          })),
        }),

      getTestSuitesBySetupIndex: (index) =>
        get().setups[index]?.testSuites || [],

      updateSetupTestSuite: (
        setupIndex: number,
        testSuiteIndex: number,
        testSuite: CreateProblemTestSuiteModel
      ) =>
        set({
          setups: get().setups.map((setup, sIndex) =>
            sIndex === setupIndex
              ? {
                  ...setup,
                  testSuites: (setup.testSuites ?? []).map((ts, tIndex) =>
                    tIndex === testSuiteIndex ? testSuite : ts
                  ),
                }
              : setup
          ),
        }),
      addTestCaseToSetupTestSuite: (setupIndex, testSuiteIndex, testCase) =>
        set({
          setups: get().setups.map((setup, sIndex) => {
            if (sIndex !== setupIndex) return setup;

            const suites = setup.testSuites ?? [];
            return {
              ...setup,
              testSuites: suites.map((suite, tIndex) =>
                tIndex === testSuiteIndex
                  ? {
                      ...suite,
                      testCases: [...(suite.testCases ?? []), testCase],
                    }
                  : suite
              ),
            };
          }),
        }),

      updateSetupTestCase: (
        setupIndex,
        testSuiteIndex,
        testCaseIndex,
        testCase
      ) =>
        set({
          setups: get().setups.map((setup, sIndex) => {
            if (sIndex !== setupIndex) return setup;

            return {
              ...setup,
              testSuites: (setup.testSuites ?? []).map((suite, tIndex) =>
                tIndex === testSuiteIndex
                  ? {
                      ...suite,
                      testCases: (suite.testCases ?? []).map((tc, cIndex) =>
                        cIndex === testCaseIndex ? testCase : tc
                      ),
                    }
                  : suite
              ),
            };
          }),
        }),
      removeTestCaseToSetupTestSuite: (
        setupIndex,
        testSuiteIndex,
        testCaseIndex
      ) =>
        set({
          setups: get().setups.map((setup, sIndex) => {
            if (sIndex !== setupIndex) return setup;

            return {
              ...setup,
              testSuites: (setup.testSuites ?? []).map((suite, tIndex) =>
                tIndex === testSuiteIndex
                  ? {
                      ...suite,
                      testCases: (suite.testCases ?? []).filter(
                        (_, cIndex) => cIndex !== testCaseIndex
                      ),
                    }
                  : suite
              ),
            };
          }),
        }),
      getTestCasesBySetupTestSuiteIndex: (setupIndex, testSuiteIndex) =>
        get().setups[setupIndex]?.testSuites?.[testSuiteIndex]?.testCases || [],

      createProblem: () => {
        const state = get();

        const markdownQuestion = lexicalToMarkdown(state.questionState);

        const problem: CreateProblemModel = {
          title: state.title,
          question: markdownQuestion,
          tags: state.tags,
          difficulty: state.difficulty,
          setups: state.setups,
        };

        return problem;
      },
    }))
  )
);
