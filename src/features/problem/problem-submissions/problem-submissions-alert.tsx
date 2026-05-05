import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React from "react";
import { AlertTriangle } from "lucide-react";

type ProblemSubmissionsAlertProps = React.ComponentProps<"div"> & {
  error?: Error;
};

export default function ProblemSubmissionsAlert({
  error: errorProp,
  ...props
}: ProblemSubmissionsAlertProps) {
  return (
    <Alert variant="destructive" {...props}>
      <AlertTriangle />
      <AlertTitle>Error loading submissions</AlertTitle>
      <AlertDescription>
        {errorProp?.message ??
          "An unexpected error occurred while loading submissions."}
      </AlertDescription>
    </Alert>
  );
}
