import { Badge } from "@/shared/components/ui/badge";
import { Trophy } from "lucide-react";

type ScoreBadgeProps = {
  score: number;
};

export default function ScoreBadge({ score }: Readonly<ScoreBadgeProps>) {
  return (
    <Badge variant="secondary" className="h-7 gap-1.5 px-2.5 text-sm">
      <Trophy
        aria-hidden="true"
        data-icon="inline-start"
        className="size-3.5"
      />
      Score: {score}
    </Badge>
  );
}
