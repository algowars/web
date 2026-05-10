import { Badge } from "@/components/ui/badge";
import { SubmissionStatus } from "@/features/problem/models/submission-status";
import { cn } from "@/lib/utils";
import { CheckCircle2, LucideIcon, X } from "lucide-react";

type SubmissionsStatusBadgeProps = {
  status: SubmissionStatus;
} & React.ComponentProps<"span">;

const statusMap: Partial<
  Record<
    SubmissionStatus,
    { label: string; className: string; icon: LucideIcon }
  >
> = {
  [SubmissionStatus.ACCEPTED]: {
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle2,
    label: "Accepted",
  },
  [SubmissionStatus.WRONG_ANSWER]: {
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: X,
    label: "Wrong Answer",
  },
};

export default function SubmissionStatusBadge({
  status,
  className,
  ...props
}: SubmissionsStatusBadgeProps) {
  const config = statusMap[status];
  const Icon = config?.icon;

  return (
    <Badge
      variant="secondary"
      className={cn(
        "px-3 py-1 text-sm [&>svg]:size-4",
        config?.className,
        className
      )}
      {...props}
    >
      {Icon ? <Icon aria-hidden="true" /> : null}
      {config?.label ?? status}
    </Badge>
  );
}
