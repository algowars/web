import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ComponentProps } from "react";
import { ProblemSubmission } from "../models/problem-submission";

type ProblemSubmissionsCardProps = {
  submission: ProblemSubmission;
} & ComponentProps<"div">;

export default function ProblemSubmissionsCard(
  props: Readonly<ProblemSubmissionsCardProps>
) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Submissions</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
