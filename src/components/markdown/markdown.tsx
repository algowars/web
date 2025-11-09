import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

type Props = {
  markdown: string | null | undefined;
  allowHtml?: boolean;
  className?: string;
  components?: Partial<Components>;
};

const defaultComponents: Partial<Components> = {
  // Headings
  h1: ({ node, ...props }) => (
    <h1 className="text-xl font-semibold tracking-tight" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="text-xl font-semibold tracking-tight" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="text-xl font-semibold tracking-tight" {...props} />
  ),

  // Paragraph
  p: ({ node, ...props }) => (
    <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />
  ),

  // Links
  a: ({ node, href, ...props }) => (
    <a
      href={href ?? "#"}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="text-indigo-600 hover:underline"
      {...props}
    />
  ),

  // Lists
  ul: ({ node, ...props }) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />
  ),
  li: ({ node, ...props }) => <li className="my-1" {...props} />,

  // Blockquote
  blockquote: ({ node, ...props }) => (
    <blockquote className="mt-6 border-l-2 pl-6 italic" {...props} />
  ),

  // Table (basic)
  table: ({ node, ...props }) => <table className="w-full" {...props} />,
  thead: ({ node, ...props }) => <thead className="bg-slate-100" {...props} />,
  tbody: ({ node, ...props }) => <tbody {...props} />,
  tr: ({ node, ...props }) => (
    <tr className="even:bg-muted m-0 border-t p-0" {...props} />
  ),
  th: ({ node, ...props }) => (
    <th
      className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),
  td: ({ node, ...props }) => (
    <td
      className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    />
  ),

  // Images
  img: ({ node, src, alt, ...props }) => (
    <img
      src={src ?? undefined}
      alt={alt ?? ""}
      className="max-w-full rounded"
      {...props}
    />
  ),

  // pre is usually handled by code above, but keep a fallback
  pre: ({ node, ...props }) => (
    <pre
      className="bg-slate-800 text-slate-100 p-4 rounded my-4 overflow-auto"
      {...props}
    />
  ),
  code: ({ node, ...props }) => (
    <code
      className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
      {...props}
    />
  ),
};

export default function MarkdownSafe({
  markdown = "",
  components,
  className = "text-card-foreground",
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
