"use client";

import CodeMirror, { Extension } from "@uiw/react-codemirror";
import { CreateProblemSetup } from "../models/create-problem-setup-model";
import { useTheme } from "next-themes";
import { tokyoNightDay } from "@uiw/codemirror-theme-tokyo-night-day";
import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm";
import React from "react";
import {
  defaultCodeEditorExtensions,
  loadLanguageExtensions,
} from "@/components/code-editor/code-editor-extensions";
import { useCreateProblemStore } from "../create-problem-store";

type CreateProblemSetupInfoSolutionProps = {
  setup: CreateProblemSetup;
  setupIndex: number;
};

export default function CreateProblemSetupInfoSolution({
  setup,
  setupIndex,
}: CreateProblemSetupInfoSolutionProps) {
  const theme = useTheme();
  const getLanguageByVersionId = useCreateProblemStore(
    (s) => s.getLanguageByVersionId
  );
  const changeSetupInitialCode = useCreateProblemStore(
    (s) => s.changeSetupInitialCode
  );
  const language = getLanguageByVersionId(setup.languageVersionIds[0]);
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
      value={setup.initialCode}
      height="100%"
      onChange={(value: string) => changeSetupInitialCode(setupIndex, value)}
      basicSetup={{
        foldGutter: false,
        dropCursor: false,
        allowMultipleSelections: false,
        indentOnInput: false,
        tabSize: 4,
      }}
      extensions={[...defaultCodeEditorExtensions, ...langExtensions]}
      theme={theme.resolvedTheme === "light" ? tokyoNightDay : tokyoNightStorm}
    />
  );
}
