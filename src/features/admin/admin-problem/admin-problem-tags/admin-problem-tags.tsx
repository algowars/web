"use client";

import React from "react";
import { useAdminProblemContext } from "../admin-problem-context";
import { Badge } from "@/components/ui/badge";

export default function AdminProblemTags() {
  const context = useAdminProblemContext();
  const problem = context?.problem;

  if (!problem) {
    return null;
  }

  return (
    <div className="flex justify-end gap-2 flex-wrap">
      {problem.tags.length > 0 ? (
        problem.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="px-2">
            {tag}
          </Badge>
        ))
      ) : (
        <span className="text-muted-foreground text-sm">No tags</span>
      )}
    </div>
  );
}
