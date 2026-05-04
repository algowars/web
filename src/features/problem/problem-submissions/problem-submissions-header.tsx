import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProblemSubmissionsStore } from "./problem-submissions-store";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import MarkdownSafe from "@/components/markdown/markdown";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ProblemSubmissionsHeaderProps = React.ComponentProps<typeof Card>;

export default function ProblemSubmissionsHeader({
  className,
  ...props
}: ProblemSubmissionsHeaderProps) {
  const problem = useProblemSubmissionsStore((s) => s.problem);

  if (!problem) {
    return null;
  }

  return (
    <Card {...props} className={cn("pb-1", className)}>
      <CardHeader className="gap-4">
        <CardTitle>{problem.title}</CardTitle>
        <CardDescription className="flex gap-2">
          {problem.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </CardDescription>
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
