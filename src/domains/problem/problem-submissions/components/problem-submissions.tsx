import { Card, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ComponentProps } from "react";

type ProblemSubmissionsProps = ComponentProps<"div">;

export default function ProblemSubmissions(
  props: Readonly<ProblemSubmissionsProps>
) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Submissions</CardTitle>
      </CardHeader>
    </Card>
  );
}
