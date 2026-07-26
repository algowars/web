import SolutionEditor from "@/domains/workspace/solution-editor/components/solution-editor";
import { WorkspaceEvents } from "@/domains/workspace/state/workspace-events";
import { selectWorkspaceCode } from "@/domains/workspace/state/workspace-slice";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";

export default function ProblemSolutionEditor() {
  const dispatch = useAppDispatch();
  const code = useAppSelector(selectWorkspaceCode);

  return (
    <SolutionEditor
      value={code}
      onChange={(value) => dispatch(WorkspaceEvents.codeChanged(value))}
    />
  );
}
