import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";

type ProblemSubmissionsFilterProps = {
  isDisabled?: boolean;
} & React.ComponentProps<"div">;

export default function ProblemSubmissionsFilter({
  isDisabled,
  ...props
}: Readonly<ProblemSubmissionsFilterProps>) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Filter Submissions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <RadioGroup defaultValue="my-submissions">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="my-submissions"
                id="my-submissions"
                disabled={isDisabled}
              />
              <Label htmlFor="my-submissions">My Submissions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="user-solutions"
                id="user-solutions"
                disabled={isDisabled}
              />
              <Label htmlFor="user-solutions">User Solutions</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <h3 className="font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm mb-3">
            Sort By
          </h3>
          <RadioGroup defaultValue="newest">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="newest"
                id="newest"
                disabled={isDisabled}
              />
              <Label htmlFor="newest">Newest</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="oldest"
                id="oldest"
                disabled={isDisabled}
              />
              <Label htmlFor="oldest">Oldest</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
