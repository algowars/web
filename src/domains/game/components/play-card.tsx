import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import { ChevronRight, Clock, Group, LucideIcon, Trophy } from "lucide-react";
import { ComponentProps } from "react";

type PlayCardProps = {
  color: "lime" | "sky" | "fuchsia";
  icon: LucideIcon;
  header: string;
  tidbit: string;
  description: string;
  playerCount: string;
  time: string;
  onClick: () => void;
  type: string;
} & ComponentProps<"div">;

export default function PlayCard({
  color,
  icon: Icon,
  header,
  tidbit,
  description,
  playerCount,
  time,
  onClick,
  type,
  ...props
}: Readonly<PlayCardProps>) {
  return (
    <Card {...props}>
      <CardHeader>
        <div>
          <Icon className={`h-6 w-6 text-${color}-500`} />
          <span
            className={`p-1 rounded-pill bg-${color}-500 text-${color}-400`}
          >
            {type}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">{header}</h3>
          <span className={`text-${color}-500`}>{tidbit}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
        <div>
          <span>
            <Group /> {playerCount}
          </span>
          <span>
            <Clock /> {time}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onClick} variant="ghost">
          <Trophy /> Play now <ChevronRight />
        </Button>
      </CardFooter>
    </Card>
  );
}
