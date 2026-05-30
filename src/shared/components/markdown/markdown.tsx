"use client";

import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import CodeBlock from "@/shared/components/code-block/code-block";

type Props = {
  markdown: string | null | undefined;
  allowHtml?: boolean;
  className?: string;
  components?: Partial<Components>;
};

const defaultComponents: Partial<Components> = {
  h1: ({ ...props }) => (
    <h1
      className="scroll-m-20 text-2xl font-bold tracking-tight mt-6 mb-3 first:mt-0"
      {...props}
    />
  ),
  h2: ({ ...props }) => (
    <h2
      className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-2 first:mt-0"
      {...props}
    />
  ),
  h3: ({ ...props }) => (
    <h3
      className="scroll-m-20 text-lg font-semibold tracking-tight mt-4 mb-2 first:mt-0"
      {...props}
    />
  ),
  h4: ({ ...props }) => (
    <h4
      className="scroll-m-20 text-base font-semibold tracking-tight mt-4 mb-1"
      {...props}
    />
  ),

  p: ({ ...props }) => (
    <p className="leading-7 text-sm not-first:mt-4" {...props} />
  ),

  a: ({ href, ...props }) => (
    <a
      href={href ?? "#"}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="text-primary font-medium underline underline-offset-4 hover:opacity-80"
      {...props}
    />
  ),

  ul: ({ ...props }) => (
    <ul className="my-4 ml-6 list-disc space-y-1 text-sm" {...props} />
  ),
  ol: ({ ...props }) => (
    <ol className="my-4 ml-6 list-decimal space-y-1 text-sm" {...props} />
  ),
  li: ({ ...props }) => <li className="leading-7" {...props} />,

  blockquote: ({ ...props }) => (
    <blockquote
      className="mt-4 border-l-4 border-primary/40 pl-4 italic text-muted-foreground text-sm"
      {...props}
    />
  ),

  hr: ({ ...props }) => <hr className="my-6 border-border" {...props} />,

  strong: ({ ...props }) => <strong className="font-semibold" {...props} />,
  em: ({ ...props }) => <em className="italic" {...props} />,

  table: ({ ...props }) => (
    <div className="my-4 overflow-x-auto rounded-md border border-border">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: ({ ...props }) => (
    <thead className="border-b border-border bg-muted/50" {...props} />
  ),
  tbody: ({ ...props }) => (
    <tbody className="divide-y divide-border" {...props} />
  ),
  tr: ({ ...props }) => (
    <tr className="transition-colors hover:bg-muted/40" {...props} />
  ),
  th: ({ ...props }) => (
    <th
      className="px-4 py-2 text-left font-semibold text-muted-foreground [[align=center]]:text-center [[align=right]]:text-right"
      {...props}
    />
  ),
  td: ({ ...props }) => (
    <td
      className="px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right"
      {...props}
    />
  ),

  img: ({ src, alt, ...props }) => (
    <img
      src={src ?? undefined}
      alt={alt ?? ""}
      className="max-w-full rounded-md my-4"
      {...props}
    />
  ),

  pre: ({ children }) => {
    const child = React.Children.toArray(children)[0] as React.ReactElement<{
      className?: string;
      children?: React.ReactNode;
    }>;
    const className = child?.props?.className ?? "";
    const match = /language-(\w+)/.exec(className);

    if (match) {
      const language = match[1];
      const code = String(child?.props?.children ?? "").replace(/\n$/, "");
      return <CodeBlock language={language}>{code}</CodeBlock>;
    }

    return (
      <pre className="bg-muted rounded-lg p-4 my-4 overflow-auto text-sm font-mono border border-border">
        {children}
      </pre>
    );
  },

  code: ({ className, children, ...props }) => {
    const isBlock = /language-(\w+)/.test(className ?? "");
    if (isBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[0.8em]"
        {...props}
      >
        {children}
      </code>
    );
  },
};

export default function MarkdownSafe({
  markdown = "",
  components,
  className = "text-foreground",
}: Props) {
  const mergedComponents: Partial<Components> = {
    ...defaultComponents,
    ...components,
  };

  return (
    <article className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={mergedComponents}
        skipHtml={true}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
