import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

type WorkspaceState = {
  selectedVersionId: string | null;
};

type WorkspaceActiosn = {
  setSelectedVersionId: (versionId: string | null) => void;
};

type WorkspaceStore = WorkspaceState & WorkspaceActiosn;

export const useWorkspaceStore = create<WorkspaceStore>()(
  subscribeWithSelector(
    devtools((set) => ({
      selectedVersionId: null,
      setSelectedVersionId: (versionId) =>
        set({ selectedVersionId: versionId }),
    }))
  )
);
