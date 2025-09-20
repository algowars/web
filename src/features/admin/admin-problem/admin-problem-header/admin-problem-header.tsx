"use client";

import React from "react";
import { useAdminProblemContext } from "../admin-problem-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dot, FolderGit2 } from "lucide-react";
import { ProblemStatusBadge } from "@/features/problem/problem-status-badge/problem-status-badge";
import { ProblemDifficultyBadge } from "@/features/problem/problem-difficulty-badge/problem-difficulty-badge";
import AdminProblemSubmissions from "../admin-problem-submissions/admin-problem-submissions";
import AdminProblemAcceptanceRate from "../admin-problem-acceptance-rate/admin-problem-acceptrance-rate";
import AdminProblemLanguages from "../admin-problem-languages/admin-problem-languages";
import AdminProblemTags from "../admin-problem-tags/admin-problem-tags";

export default function AdminProblemHeader() {
  const context = useAdminProblemContext();
  const problem = context?.problem;

  if (!problem) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        <div className="flex items-center gap-3">
          <FolderGit2 />
          <div>
            <CardTitle className="text-2xl font-semibold">
              {problem.title}
            </CardTitle>
            <CardDescription className="flex items-center flex-wrap gap-2">
              <span className="text-muted-foreground">/{problem.slug}</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">
                Created by <b>{problem.createdBy.username}</b>
              </span>
              <Dot />
              <span className="text-muted-foreground">
                {problem.createdAt.toDateString()}
              </span>
            </CardDescription>
          </div>
        </div>
        <div className="flex flex-col gap-3 md:ml-auto">
          <div className="flex flex-row gap-2">
            <ProblemStatusBadge status={problem.status} />
            <ProblemDifficultyBadge difficulty={problem.difficulty.rating} />
          </div>
          <AdminProblemTags />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AdminProblemSubmissions />
          <AdminProblemAcceptanceRate />
          <AdminProblemLanguages />
        </div>
      </CardContent>
    </Card>
  );
}
