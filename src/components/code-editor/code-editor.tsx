"use client";

/* eslint-disable @typescript-eslint/no-unsafe-call */
// import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm";
// import { tokyoNightDay } from "@uiw/codemirror-theme-tokyo-night-day";

import React from "react";
import CodeMirror, { Extension } from "@uiw/react-codemirror";
import { useTheme } from "next-themes";
import { Language } from "@/features/problems/models/language";
import { vscodeDark, vscodeLight } from "@uiw/codemirror-theme-vscode";

import {
  defaultCodeEditorExtensions,
  loadLanguageExtensions,
} from "./code-editor-extensions";

type Props = {
  code: string;
  changeCode: (value: string) => void;
  className?: string;
  language: Language;
};

export const CodeEditor = ({
  code,
  changeCode,
  language,
  className,
}: Props) => {
  const theme = useTheme();
  const [langExtensions, setLangExtensions] = React.useState<Extension[]>([]);

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
      }}
      extensions={[...defaultCodeEditorExtensions, ...langExtensions]}
      // theme={theme.resolvedTheme === "light" ? tokyoNightDay : tokyoNightStorm}
      theme={theme.resolvedTheme === "light" ? vscodeLight : vscodeDark}
    />
  );
};
