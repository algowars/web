"use client";

import SyntaxHighlighter, {
  SyntaxHighlighterProps,
} from "react-syntax-highlighter";
import {
  atomOneDark,
  atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useTheme } from "next-themes";

type CodeBlockProps = {
  language: string;
} & Omit<SyntaxHighlighterProps, "language" | "style">;

export default function CodeBlock({
  children,
  language,
  ...props
}: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const style = resolvedTheme === "dark" ? atomOneDark : atomOneLight;

  return (
    <SyntaxHighlighter
      language={language}
      style={style}
      customStyle={{
        borderRadius: "0.375rem",
        fontSize: "0.875rem",
        border: "1px solid var(--border)",
      }}
      {...props}
    >
      {children}
    </SyntaxHighlighter>
  );
}
