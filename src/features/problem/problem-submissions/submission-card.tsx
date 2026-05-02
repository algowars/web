import { Card, CardContent } from "@/components/ui/card";
import { Submission } from "../models/submission";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import React from "react";

type SubmissionCardProps = {
  submission: Submission;
};

export default function SubmissionCard({ submission }: SubmissionCardProps) {
  if (!submission.createdBy) {
    return null;
  }

  const initials = submission.createdBy.username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Extract language from the code if possible, or show generic "Code"
  const codePreview = submission.code.substring(0, 200);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Avatar className="h-12 w-12 flex-shrink-0">
            {submission.createdBy.imageUrl && (
              <AvatarImage
                src={submission.createdBy.imageUrl}
                alt={submission.createdBy.username}
              />
            )}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm">{submission.createdBy.username}</h3>
            <p className="text-xs text-muted-foreground">
              {new Date(submission.createdOn).toLocaleDateString()}
            </p>

            <div className="mt-3 space-y-2">
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto max-h-32">
                <code>{codePreview}</code>
                {submission.code.length > 200 && (
                  <div className="text-muted-foreground text-xs mt-1">
                    ... ({submission.code.length - 200} more characters)
                  </div>
                )}
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
