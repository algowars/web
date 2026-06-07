"use client";

import type { Extension } from "@uiw/react-codemirror";
import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";
import { cn } from "@/shared/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import {
  getLanguageExtensionsById,
  type LanguageExtensionOptions,
} from "../extensions/language-extension-map";

interface SolutionEditorProps extends ReactCodeMirrorProps {
  languageId?: number;
  languageOptions?: LanguageExtensionOptions;
}

export default function SolutionEditor({
  languageId = 0,
  languageOptions,
  ...props
}: SolutionEditorProps) {
  const { resolvedTheme } = useTheme();
  const [languageExtensions, setLanguageExtensions] = useState<Extension[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const extensions = await getLanguageExtensionsById(
        languageId,
        languageOptions
      );
      if (!cancelled) {
        setLanguageExtensions(extensions);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [languageId, languageOptions]);

  return (
    <CodeMirror
      {...props}
      extensions={[...languageExtensions, ...(props.extensions ?? [])]}
      height={props.height ?? "100%"}
      className={cn("h-full", props.className)}
      theme={resolvedTheme === "light" ? vscodeLight : vscodeDark}
    />
  );
}
