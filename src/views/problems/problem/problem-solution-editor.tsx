"use client";

import SolutionEditor from "@/domains/workspace/solution-editor/components/solution-editor";
import {
  useWorkspaceStore,
  selectWorkspaceCode,
} from "@/domains/workspace/state/workspace-store";

export default function ProblemSolutionEditor() {
  const code = useWorkspaceStore(selectWorkspaceCode);
  const setCode = useWorkspaceStore((s) => s.setCode);

  return <SolutionEditor value={code} onChange={setCode} />;
}
