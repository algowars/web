import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useProblemSubmissionsStore } from "./problem-submissions-store";
import { ProblemSubmissionsOptions } from "./problem-submissions-options";

type ProblemSubmissionsFilterProps = React.ComponentProps<"div"> & {
  isDisabled?: boolean;
};

export default function ProblemSubmissionsFilter({
  isDisabled,
  ...props
}: ProblemSubmissionsFilterProps) {
  const filterOption = useProblemSubmissionsStore((s) => s.filterOption);
  const changeFilterOption = useProblemSubmissionsStore(
    (s) => s.changeFilterOption
  );
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Filter</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={filterOption}
          disabled={isDisabled}
          onValueChange={(value) =>
            changeFilterOption(value as ProblemSubmissionsOptions)
          }
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem
              value={ProblemSubmissionsOptions.ALL_SOLUTIONS}
              id="all-solutions"
            />
            <Label htmlFor="all-solutions">All Solutions</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem
              value={ProblemSubmissionsOptions.MY_SUBMISSIONS}
              id="my-submissions"
            />
            <Label htmlFor="my-submissions" data-cy="my-submissions-filter">
              My Submissions
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
