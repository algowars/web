import { describe, it, expect, beforeEach } from "vitest";
import { useProblemEditorStore } from "./problem-editor-store";
import { Language } from "@/features/problems/models/language";
import { Problem } from "@/features/problems/models/problem";
import { Account } from "@/features/auth/models/account.model";

describe("ProblemEditorStore", () => {
  beforeEach(() => {
    useProblemEditorStore.setState({
      setup: null,
      problem: null,
      code: "",
      currentVersion: null,
    });
  });

  const createdBy: Account = {
    id: "fake-guid",
    username: "Test user",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const sampleLanguages: Language[] = [
    {
      id: 1,
      name: "JavaScript",
      versions: [
        { id: 11, version: "ES5" },
        { id: 12, version: "ES6" },
      ],
    },
    {
      id: 2,
      name: "Python",
      versions: [
        { id: 21, version: "3.8" },
        { id: 22, version: "3.9" },
      ],
    },
  ];

  const sampleProblem: Problem = {
    id: "p1",
    title: "Sample Problem",
    slug: "sample-problem",
    difficulty: {
      rating: 1500,
      name: "Medium",
    },
    tags: ["test"],
    availableLanguages: sampleLanguages,
  };

  const sampleSetup = {
    id: 1,
    defaultLanguageId: 1,
    defaultLanguageVersionId: 12,
    createdOn: Date.now(),
    createdBy,
    version: 1,
    problem: sampleProblem,
    languageVersionId: 12,
    initialCode: "console.log('Hello')",
  };

  it("should set setup and initialize code and currentVersion", () => {
    useProblemEditorStore.getState().setSetup(sampleSetup);
    const state = useProblemEditorStore.getState();

    expect(state.setup).toBe(sampleSetup);
    expect(state.code).toBe("console.log('Hello')");
    expect(state.currentVersion?.id).toBe(11);
  });

  it("should set problem correctly", () => {
    useProblemEditorStore.getState().setProblem(sampleProblem);
    const state = useProblemEditorStore.getState();
    expect(state.problem).toBe(sampleProblem);
  });

  it("should update and reset code", () => {
    useProblemEditorStore.getState().setSetup(sampleSetup);
    useProblemEditorStore.getState().setCode("new code");
    let state = useProblemEditorStore.getState();
    expect(state.code).toBe("new code");

    useProblemEditorStore.getState().resetCode();
    state = useProblemEditorStore.getState();
    expect(state.code).toBe("console.log('Hello')");
  });

  it("should set currentVersion and resolve it", () => {
    useProblemEditorStore.getState().setSetup(sampleSetup);

    const jsES6Version = sampleProblem.availableLanguages[0].versions[1];
    useProblemEditorStore.getState().setCurrentVersion(jsES6Version);

    const state = useProblemEditorStore.getState();
    expect(state.currentVersion?.id).toBe(12);

    const resolvedVersion = state.getResolvedVersion();
    console.log(
      "RESOLVED VERSION: ",
      resolvedVersion,
      state,
      state.currentVersion
    );
    expect(resolvedVersion?.version).toBe("ES6");
  });

  it("should resolve current language correctly", () => {
    useProblemEditorStore.getState().setSetup(sampleSetup);

    const python39Version = sampleProblem.availableLanguages[1].versions[1];
    useProblemEditorStore.getState().setCurrentVersion(python39Version);

    const state = useProblemEditorStore.getState();
    const language = state.getResolveLanguage();
    expect(language?.name).toBe("Python");
  });
});
