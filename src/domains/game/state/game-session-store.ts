import { create } from "zustand";

interface GameSessionState {
  /** Set after a problem is solved. `string` = next problem ID ready to load;
   *  `null` = last problem solved, game over. `undefined` = not yet solved. */
  pendingNextProblemId: string | null | undefined;

  viewingProblemId: string | null;

  problemSolved: (nextProblemId: string | null) => void;
  nextProblemLoading: () => void;
  viewProblem: (problemId: string) => void;
  returnToCurrentProblem: () => void;
  reset: () => void;
}

export const useGameSessionStore = create<GameSessionState>((set) => ({
  pendingNextProblemId: undefined,
  viewingProblemId: null,

  problemSolved: (nextProblemId) =>
    set({ pendingNextProblemId: nextProblemId }),

  nextProblemLoading: () =>
    set({ pendingNextProblemId: undefined, viewingProblemId: null }),

  viewProblem: (problemId) => set({ viewingProblemId: problemId }),

  returnToCurrentProblem: () => set({ viewingProblemId: null }),

  reset: () => set({ pendingNextProblemId: undefined, viewingProblemId: null }),
}));

export const selectPendingNextProblemId = (s: GameSessionState) =>
  s.pendingNextProblemId;

export const selectViewingProblemId = (s: GameSessionState) =>
  s.viewingProblemId;
