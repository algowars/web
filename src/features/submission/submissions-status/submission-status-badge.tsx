import { Badge, BadgeVariant } from "@/components/ui/badge";
import { SubmissionStatus } from "@/features/problem/models/submission-status";
import { cn } from "@/lib/utils";
import { CheckCircle2, LucideIcon, X } from "lucide-react";

type SubmissionsStatusBadgeProps = {
  status: SubmissionStatus;
} & React.ComponentProps<"span">;

const statusMap: Partial<
  Record<
    SubmissionStatus,
    { label: string; variant: BadgeVariant; icon: LucideIcon }
  >
> = {
  [SubmissionStatus.ACCEPTED]: {
    variant: "success",
    icon: CheckCircle2,
    label: "Accepted",
  },
  [SubmissionStatus.WRONG_ANSWER]: {
    variant: "destructive",
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
      variant={config?.variant ?? "secondary"}
      className={cn("px-3 py-1 text-sm [&>svg]:size-4", className)}
      {...props}
    >
      {Icon ? <Icon aria-hidden="true" /> : null}
      {config?.label ?? status}
    </Badge>
  );
}
