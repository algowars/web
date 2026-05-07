import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Problem } from "@/features/problems/models/problem";
import { ProblemDifficultyBadge } from "@/features/problem/problem-difficulty-badge/problem-difficulty-badge";
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
      <div className="px-5 pt-5 pb-4">
        <h2 className="text-xl font-bold tracking-tight mb-2">
          {problem.title}
        </h2>
        <div className="flex items-center gap-2">
          <ProblemDifficultyBadge difficulty={problem.difficulty} />
        </div>
      </div>

      <Separator />

      <div className="px-5 py-4 flex-1">{questionMemo}</div>

      <Accordion type="single" collapsible className="border-t">
        <AccordionItem value="tags">
          <AccordionTrigger className="px-5 py-3 text-sm">
            <span className="flex items-center gap-1.5">
              <Tag size={14} /> Tags
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ProblemEditorTags tags={problem.tags ?? []} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <p className="px-5 py-3 text-xs text-muted-foreground border-t">
        &copy; 2026 Algowars
      </p>
    </div>
  );
}
