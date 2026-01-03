"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAdminProblemContext } from "../admin-problem-context";

export default function AdminProblemLanguages() {
  const adminProblemContext = useAdminProblemContext();
  const problem = adminProblemContext?.problem;

  const languages =
    problem?.availableLanguages?.map((lang) => ({
      id: lang.id,
      name: lang.name,
    })) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Languages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {languages.length > 0 ? (
            languages.map((lang) => (
              <Badge key={lang.id} variant="outline">
                {lang.name}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">No languages</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
