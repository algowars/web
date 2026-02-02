"use client";

import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {  SerializedEditorState } from "lexical";

import { editorTheme } from "@/components/editor/themes/editor-theme";
import { TooltipProvider } from "@/components/ui/tooltip";

import { nodes } from "./nodes";
import { Plugins } from "./plugins";
import { cn } from "@/lib/utils";

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error);
  },
};

export function Editor({
  editorSerializedState,
  onSerializedChange,
  className,
}: {
  editorSerializedState?: SerializedEditorState;
  onSerializedChange?: (state: SerializedEditorState) => void;
  className?: string;
}) {
  return (
    <div className={cn("bg-background overflow-hidden rounded-lg border shadow", className)}>
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorSerializedState
            ? { editorState: JSON.stringify(editorSerializedState) }
            : {}),
        }}
      >
        <TooltipProvider>
          <Plugins />
          <OnChangePlugin
            ignoreSelectionChange
            onChange={(editorState) => {
              onSerializedChange?.(editorState.toJSON());
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}
