import { useProblemEditorStore } from "./problem-editor-store";

describe("useProblemEditorStore", () => {
  beforeEach(() => {
    useProblemEditorStore.setState({
      setup: null,
      problem: null,
      code: "",
      currentVersionId: null,
    });
  });

  it("changes code correctly", () => {
    const store = useProblemEditorStore.getState();

    store.actions.changeCode("Test code");

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

    useProblemEditorStore.getState().actions.setProblem(fakeProblem as any);

    const state = useProblemEditorStore.getState();
    expect(state.problem).toBe(fakeProblem);
    expect(state.currentVersionId).toBe(101);
  });
});
