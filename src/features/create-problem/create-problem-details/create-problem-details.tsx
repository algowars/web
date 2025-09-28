"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useCreateProblemContext } from "../create-problem-context";
import CreateProblemDetailsQuestion from "./create-problem-details-question";
import CreateProblemTags from "./create-problem-details-tags";

export default function CreateProblemDetails() {
  const { createProblem, updateCreateProblem } = useCreateProblemContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Problem Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={createProblem.title}
            onChange={(e) => updateCreateProblem({ title: e.target.value })}
            placeholder="Enter problem title"
          />
        </div>
        <CreateProblemDetailsQuestion />
        <CreateProblemTags />
      </CardContent>
    </Card>
  );
}
