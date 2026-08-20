import { create } from "zustand";

interface GameSessionState {
  /** Set after a problem is solved. `string` = next problem ID ready to load;
   *  `null` = last problem solved, game over. `undefined` = not yet solved.
   *  Mirrors the old `pendingNextProblemId` redux field. */
  pendingNextProblemId: string | null | undefined;

  problemSolved: (nextProblemId: string | null) => void;
  nextProblemLoading: () => void;
  reset: () => void;
}

export const useGameSessionStore = create<GameSessionState>((set) => ({
  pendingNextProblemId: undefined,

  problemSolved: (nextProblemId) => set({ pendingNextProblemId: nextProblemId }),

  nextProblemLoading: () => set({ pendingNextProblemId: undefined }),

  reset: () => set({ pendingNextProblemId: undefined }),
}));

export const selectPendingNextProblemId = (s: GameSessionState) =>
  s.pendingNextProblemId;
