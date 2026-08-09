import { EditorWindowTab } from "@/domains/workspace/editor-window/editor-tab";
import { EditorWindowTabNode } from "@/domains/workspace/editor-window/state/editor-window-store";

type PlayGameWorkspaceProps = {
  readonly tab: EditorWindowTabNode;
};

export default function PlayGameWorkspace({ tab }: PlayGameWorkspaceProps) {
  return <EditorWindowTab tab={tab} />;
}
