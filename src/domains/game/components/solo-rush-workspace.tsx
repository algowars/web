"use client";

import { EditorWindowTab } from "@/domains/workspace/editor-window/editor-tab";
import { EditorWindowTabNode } from "@/domains/workspace/editor-window/state/editor-window-store";

type SoloRushWorkspaceProps = {
  readonly tab: EditorWindowTabNode;
};

/**
 * Workspace surface for the Solo Rush game mode. Mirrors the generic
 * `Workspace` component but lives in the `game` domain so it can diverge
 * (e.g. per-step timers, problem switching) without affecting the
 * standalone problem-solving workspace.
 */
export default function SoloRushWorkspace({ tab }: SoloRushWorkspaceProps) {
  return <EditorWindowTab tab={tab} />;
}
