import { create } from "zustand";
import type { ProblemSetup } from "@/domains/problem/models/problem-setup";

interface WorkspaceState {
  selectedVersionId: string | null;
  code: string;
  /** The languageVersionId that `code` was loaded for. Cleared whenever a new
   *  problem is initialized so the next setup load resets the editor. Used to
   *  distinguish "same problem, same language, setup reloaded again" (keep code)
   *  from "new problem" (reset code) or "language switched" (reset code). */
  codeVersionId: string | null;
  isSubmittingSubmission: boolean;
  activeSubmissionId: string | null;
  activeTabByNode: Record<string, number>;

  selectVersion: (versionId: string | null) => void;
  setCode: (code: string) => void;
  /** Flip the "submitting" UI state on synchronously — mirrors the old
   *  runCodeRequested/submitCodeRequested reducers, which cleared
   *  activeSubmissionId and set isSubmittingSubmission in the same update so the
   *  two flags never render out of sync (the old "previous-status flash" bug). */
  beginSubmission: () => void;
  setSubmittingSubmission: (isSubmitting: boolean) => void;
  setActiveSubmissionId: (submissionId: string | null) => void;
  onNewProblem: () => void;
  onProblemSetupLoaded: (
    setup: ProblemSetup,
    languageVersionId: string
  ) => void;
  setActiveTab: (nodeId: string, tabIndex: number) => void;
  reset: () => void;
}

const initialState = {
  selectedVersionId: null,
  code: "",
  codeVersionId: null,
  isSubmittingSubmission: false,
  activeSubmissionId: null,
  activeTabByNode: {},
} satisfies Partial<WorkspaceState>;

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  ...initialState,

  selectVersion: (versionId) => set({ selectedVersionId: versionId }),

  setCode: (code) => set({ code }),

  beginSubmission: () =>
    set({ activeSubmissionId: null, isSubmittingSubmission: true }),

  setSubmittingSubmission: (isSubmitting) =>
    set({ isSubmittingSubmission: isSubmitting }),

  setActiveSubmissionId: (submissionId) =>
    set({ activeSubmissionId: submissionId }),

  onNewProblem: () =>
    // A new problem is loading — clear the version marker so the upcoming
    // onProblemSetupLoaded will reset the editor code and submission state.
    set({ codeVersionId: null, activeSubmissionId: null }),

  onProblemSetupLoaded: (setup, languageVersionId) =>
    set((state) => {
      if (languageVersionId !== state.codeVersionId) {
        // New problem (codeVersionId was cleared by onNewProblem) or the user
        // switched language — reset the editor to the initial template.
        return {
          code: setup.initialCode ?? "",
          codeVersionId: languageVersionId,
        };
      }
      // Same problem + same language version reloading (e.g. LanguageSelect
      // auto-selecting the default on mount): do nothing — keep the user's code
      // and any active submission state exactly as they were.
      return {};
    }),

  setActiveTab: (nodeId, tabIndex) =>
    set((state) => ({
      activeTabByNode: { ...state.activeTabByNode, [nodeId]: tabIndex },
    })),

  reset: () => set(initialState),
}));

export const selectSelectedVersionId = (s: WorkspaceState) =>
  s.selectedVersionId;

export const selectWorkspaceCode = (s: WorkspaceState) => s.code;

export const selectIsSubmittingSubmission = (s: WorkspaceState) =>
  s.isSubmittingSubmission;

export const selectActiveSubmissionId = (s: WorkspaceState) =>
  s.activeSubmissionId;

export const selectActiveTabByNode = (s: WorkspaceState) => s.activeTabByNode;
