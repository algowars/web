import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ComponentProps } from "react";

type ProblemSubmissionsCardProps = ComponentProps<"div">;

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
