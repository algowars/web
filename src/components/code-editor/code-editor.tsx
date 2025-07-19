"use client";

/* eslint-disable @typescript-eslint/no-unsafe-call */
import { basicDark, basicLight } from "@uiw/codemirror-theme-basic";
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { useTheme } from "next-themes";
import { javascript } from "@codemirror/lang-javascript";

type Props = {
  code: string;
  changeCode: (value: string) => void;
  className?: string;
};

export const CodeEditor = ({ code, changeCode, className }: Props) => {
  const theme = useTheme();

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
      extensions={[javascript()]}
      theme={theme.resolvedTheme === "light" ? basicLight : basicDark}
    />
  );
};
