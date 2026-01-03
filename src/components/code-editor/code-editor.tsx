"use client";

import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm";
import { tokyoNightDay } from "@uiw/codemirror-theme-tokyo-night-day";

import React from "react";
import CodeMirror, { Extension } from "@uiw/react-codemirror";
import { useTheme } from "next-themes";

import {
  defaultCodeEditorExtensions,
  loadLanguageExtensions,
} from "./code-editor-extensions";
import { useProblemEditorStore } from "@/features/problem/problem-editor-store";

type Props = {
  className?: string;
};

export const CodeEditor = ({ className }: Props) => {
  const changeCode = useProblemEditorStore((s) => s.changeCode);
  const language = useProblemEditorStore((s) => s.getLanguage());

  const theme = useTheme();
  const [langExtensions, setLangExtensions] = React.useState<Extension[]>([]);
  const code = useProblemEditorStore((s) => s.code);

  const languageKey = React.useMemo(() => {
    if (!language) return "";
    if (typeof language === "string") return language;
  }, [language]);

  React.useEffect(() => {
    let mounted = true;
    setLangExtensions([]);

    async function load() {
      if (!languageKey) return setLangExtensions([]);
      try {
        const exts = await loadLanguageExtensions(languageKey);
        if (!mounted) return;
        setLangExtensions(exts);
      } catch {
        if (!mounted) return;
        setLangExtensions([]);
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [languageKey]);

  return (
    <CodeMirror
      value={code}
      height="100%"
      onChange={changeCode}
      className={className}
      basicSetup={{
        foldGutter: false,
        dropCursor: false,
        allowMultipleSelections: false,
        indentOnInput: false,
        tabSize: 4,
      }}
      extensions={[...defaultCodeEditorExtensions, ...langExtensions]}
      theme={theme.resolvedTheme === "light" ? tokyoNightDay : tokyoNightStorm}
      // theme={theme.resolvedTheme === "light" ? vscodeLight : vscodeDark}
    />
  );
};
