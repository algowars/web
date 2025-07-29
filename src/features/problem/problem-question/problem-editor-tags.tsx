"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { routerConfig } from "@/router-config";

type ProblemEditorTagsProps = {
  tags: string[];
  className?: string;
};

export default function ProblemEditorTags({
  tags,
  className = "",
}: ProblemEditorTagsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={cn("px-4", className)}>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={routerConfig.tags.execute({
              tags: [tag.toLocaleLowerCase()],
            })}
            className="inline-block"
          >
            <Badge
              variant="secondary"
              className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer text-xs px-2.5 py-1"
            >
              {tag}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
