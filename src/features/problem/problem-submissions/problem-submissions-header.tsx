import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProblemSubmissionsStore } from "./problem-submissions-store";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import MarkdownSafe from "@/components/markdown/markdown";
import React from "react";

type ProblemSubmissionsHeaderProps = React.ComponentProps<typeof Card>;

export default function ProblemSubmissionsHeader(
  props: ProblemSubmissionsHeaderProps
) {
  const problem = useProblemSubmissionsStore((s) => s.problem);

  if (!problem) {
    return null;
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>{problem.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="description">
            <AccordionTrigger>Description</AccordionTrigger>
            <AccordionContent>
              <MarkdownSafe markdown={problem.question} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
