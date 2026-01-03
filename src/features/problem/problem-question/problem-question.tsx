import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Problem } from "@/features/problems/models/problem";
import { Tag } from "lucide-react";
import React from "react";
import ProblemEditorTags from "./problem-editor-tags";
import MarkdownSafe from "@/components/markdown/markdown";

type Props = {
  problem: Problem | null;
};

export default function ProblemQuestion({ problem }: Props) {
  const questionMemo = React.useMemo(() => {
    return <MarkdownSafe markdown={problem?.question} />;
  }, [problem?.question]);

  if (!problem) {
    return null;
  }

  return (
    <div className="flex h-full flex-col overflow-auto bg-sidebar">
      <div className="p-5">
        <div className="mb-3">
          <h2 className="mb-1 text-2xl font-semibold">{problem.title}</h2>
          <ul className="flex items-center gap-4">
            {/* <li>
              <DifficultyBadge difficulty={problem.difficulty} />
            </li>
            <li>
              <ProblemEditorCreatedBy createdBy={problem.createdBy} />
            </li> */}
          </ul>
        </div>

        {questionMemo}
      </div>
      <Accordion type="single" collapsible className="mt-auto border-t">
        <AccordionItem value="tags">
          <AccordionTrigger className="p-5">
            <span className="flex items-center gap-1">
              <Tag size={16} /> Tags
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ProblemEditorTags tags={problem.tags ?? []} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <p className="p-5 text-sm text-muted-foreground">&copy; 2025 Algowars</p>
    </div>
  );
}
