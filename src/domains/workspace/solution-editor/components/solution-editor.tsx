"use client";

import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";

import { cn } from "@/shared/lib/utils";
import { useTheme } from "next-themes";

interface SolutionEditorProps extends ReactCodeMirrorProps {
  languageId?: number;
}

export default function SolutionEditor(props: SolutionEditorProps) {
  const { resolvedTheme } = useTheme();

  return (
    <CodeMirror
      {...props}
      height={props.height ?? "100%"}
      className={cn("h-full", props.className)}
      theme={resolvedTheme === "light" ? vscodeLight : vscodeDark}
    />
  );
}
