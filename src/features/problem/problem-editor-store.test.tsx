import { useProblemEditorStore } from "./problem-editor-store";
import { Problem } from "@/features/problems/models/problem";

const mockProblem: Problem = {
  id: "1",
  title: "Sample Problem",
  slug: "sample-problem",
  difficulty: 1,
  tags: [],
  availableLanguages: [
    {
      id: 10,
      name: "Python",
      versions: [
        { id: 101, version: "3.10" },
        { id: 102, version: "3.11" },
      ],
    },
    {
      id: 20,
      name: "JavaScript",
      versions: [
        { id: 201, version: "ES2022" },
        { id: 202, version: "ES2021" },
      ],
    },
  ],
};

describe("useProblemEditorStore", () => {
  beforeEach(() => {
    useProblemEditorStore.setState({
      setup: null,
      problem: null,
      code: "",
      currentVersionId: null,
      lastRunResult: null,
    });
  });

  it("changes code correctly", () => {
    const store = useProblemEditorStore.getState();

    store.changeCode("Test code");

    expect(useProblemEditorStore.getState().code).toBe("Test code");
  });

  it("sets problem and selects first version", () => {
    const fakeProblem = {
      id: 1,
      title: "Sample Problem",
      slug: "sample-problem",
      availableLanguages: [
        {
          id: 10,
          name: "Python",
          versions: [{ id: 101, version: "3.10" }],
        },
      ],
    };

    useProblemEditorStore.getState().setProblem(fakeProblem as any);

    const state = useProblemEditorStore.getState();
    expect(state.problem).toBe(fakeProblem);
    expect(state.currentVersionId).toBe(101);
  });

  describe("changeCurrentVersion", () => {
    it("sets currentVersionId from version object", () => {
      const store = useProblemEditorStore.getState();

      store.changeCurrentVersion({ id: 201, version: "ES2022" });

      expect(useProblemEditorStore.getState().currentVersionId).toBe(201);
    });

    it("sets currentVersionId to null when version is null", () => {
      useProblemEditorStore.setState({ currentVersionId: 101 });
      const store = useProblemEditorStore.getState();

      store.changeCurrentVersion(null);

      expect(useProblemEditorStore.getState().currentVersionId).toBeNull();
    });

    it("sets currentVersionId to null when version is undefined", () => {
      useProblemEditorStore.setState({ currentVersionId: 101 });
      const store = useProblemEditorStore.getState();

      store.changeCurrentVersion(undefined);

      expect(useProblemEditorStore.getState().currentVersionId).toBeNull();
    });
  });

  describe("getLanguage", () => {
    it("returns language matching currentVersionId", () => {
      useProblemEditorStore.setState({
        problem: mockProblem,
        currentVersionId: 201,
      });

      const language = useProblemEditorStore.getState().getLanguage();

      expect(language).not.toBeNull();
      expect(language?.name).toBe("JavaScript");
      expect(language?.id).toBe(20);
    });

    it("returns null when no problem is set", () => {
      useProblemEditorStore.setState({
        problem: null,
        currentVersionId: 101,
      });

      const language = useProblemEditorStore.getState().getLanguage();

      expect(language).toBeNull();
    });

    it("returns null when currentVersionId does not match any version", () => {
      useProblemEditorStore.setState({
        problem: mockProblem,
        currentVersionId: 999,
      });

      const language = useProblemEditorStore.getState().getLanguage();

      expect(language).toBeNull();
    });

    it("returns first language when version matches first language", () => {
      useProblemEditorStore.setState({
        problem: mockProblem,
        currentVersionId: 102,
      });

      const language = useProblemEditorStore.getState().getLanguage();

      expect(language?.name).toBe("Python");
    });
  });

  describe("getLanguageVersion", () => {
    it("returns version matching currentVersionId", () => {
      useProblemEditorStore.setState({
        problem: mockProblem,
        currentVersionId: 202,
      });

      const version = useProblemEditorStore.getState().getLanguageVersion();

      expect(version).not.toBeNull();
      expect(version?.version).toBe("ES2021");
      expect(version?.id).toBe(202);
    });

    it("returns null when no problem is set", () => {
      useProblemEditorStore.setState({
        problem: null,
        currentVersionId: 101,
      });

      const version = useProblemEditorStore.getState().getLanguageVersion();

      expect(version).toBeNull();
    });

    it("returns null when currentVersionId does not match any version", () => {
      useProblemEditorStore.setState({
        problem: mockProblem,
        currentVersionId: 999,
      });

      const version = useProblemEditorStore.getState().getLanguageVersion();

      expect(version).toBeNull();
    });

    it("returns correct version from first language", () => {
      useProblemEditorStore.setState({
        problem: mockProblem,
        currentVersionId: 101,
      });

      const version = useProblemEditorStore.getState().getLanguageVersion();

      expect(version?.version).toBe("3.10");
    });
  });

  describe("findVersionById", () => {
    it("finds version by id across all languages", () => {
      useProblemEditorStore.setState({
        problem: mockProblem,
      });

      const version = useProblemEditorStore.getState().findVersionById(201);

      expect(version).not.toBeNull();
      expect(version?.version).toBe("ES2022");
    });

    it("returns null when no problem is set", () => {
      useProblemEditorStore.setState({
        problem: null,
      });

      const version = useProblemEditorStore.getState().findVersionById(101);

      expect(version).toBeNull();
    });

    it("returns null when id does not match any version", () => {
      useProblemEditorStore.setState({
        problem: mockProblem,
      });

      const version = useProblemEditorStore.getState().findVersionById(999);

      expect(version).toBeNull();
    });

    it("finds version from first language", () => {
      useProblemEditorStore.setState({
        problem: mockProblem,
      });

      const version = useProblemEditorStore.getState().findVersionById(102);

      expect(version?.version).toBe("3.11");
    });
  });
});
