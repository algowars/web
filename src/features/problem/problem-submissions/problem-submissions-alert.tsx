import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useProblemSubmissionsWithStore } from "./problem-submissions-store";
import React from "react";
import { AlertTriangle } from "lucide-react";

export default function ProblemSubmissionsAlert(
  props: React.ComponentProps<"div">
) {
  const { isError: isSubmissionsError, error: submissionsError } =
    useProblemSubmissionsWithStore();

  if (isSubmissionsError) {
    return (
      <Alert variant="destructive" {...props}>
        <AlertTriangle />
        <AlertTitle>Error loading submissions</AlertTitle>
        <AlertDescription>
          {submissionsError?.message ??
            "An unexpected error occurred while loading submissions."}
        </AlertDescription>
      </Alert>
    );
  }
}
