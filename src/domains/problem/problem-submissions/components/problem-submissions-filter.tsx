import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { cn } from "@/shared/lib/utils";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import { ProblemSubmissionsEvents } from "../state/problem-submissions-events";
import {
  selectIsLoadingMoreSubmissions,
  selectIsProblemSubmissionsLoading,
  selectProblemSubmissionsFilterType,
  selectProblemSubmissionsSortBy,
} from "../state/problem-submissions-slice";
import { SubmissionFilterType } from "../models/submission-filter-type";
import { SubmissionOrderByType } from "../models/submission-order-by-type";

type ProblemSubmissionsFilterProps = {
  isDisabled?: boolean;
} & React.ComponentProps<"div">;

export default function ProblemSubmissionsFilter({
  isDisabled,
  className,
  ...props
}: Readonly<ProblemSubmissionsFilterProps>) {
  const dispatch = useAppDispatch();
  const filterType = useAppSelector(selectProblemSubmissionsFilterType);
  const sortBy = useAppSelector(selectProblemSubmissionsSortBy);
  const isLoading = useAppSelector(selectIsProblemSubmissionsLoading);
  const isLoadingMore = useAppSelector(selectIsLoadingMoreSubmissions);

  const disabled = isDisabled || isLoading || isLoadingMore;

  return (
    <Card className={cn("h-fit", className)} {...props}>
      <CardHeader>
        <CardTitle>Filter Submissions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <RadioGroup
            value={filterType}
            onValueChange={(value) =>
              dispatch(
                ProblemSubmissionsEvents.changeFilterType({
                  type: value as SubmissionFilterType,
                })
              )
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={SubmissionFilterType.UserSolutions}
                id="user-solutions"
                disabled={disabled}
              />
              <Label htmlFor="user-solutions">User Solutions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={SubmissionFilterType.MySubmissions}
                id="my-submissions"
                disabled={disabled}
              />
              <Label htmlFor="my-submissions">My Submissions</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <h3 className="font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm mb-3">
            Sort By
          </h3>
          <RadioGroup
            value={sortBy}
            onValueChange={(value) =>
              dispatch(
                ProblemSubmissionsEvents.changeSortBy({
                  sortBy: value as SubmissionOrderByType,
                })
              )
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={SubmissionOrderByType.Newest}
                id="newest"
                disabled={disabled}
              />
              <Label htmlFor="newest">Newest</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={SubmissionOrderByType.Oldest}
                id="oldest"
                disabled={disabled}
              />
              <Label htmlFor="oldest">Oldest</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
