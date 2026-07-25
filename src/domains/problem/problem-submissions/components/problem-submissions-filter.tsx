import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { cn } from "@/shared/lib/utils";
import {
  selectHasMoreSubmissions,
  selectIsLoadingMoreSubmissions,
  selectIsProblemSubmissionsLoading,
} from "../state/problem-submissions-slice";
import { useAppSelector } from "@/shared/state/hooks";

type ProblemSubmissionsFilterProps = {
  isDisabled?: boolean;
} & React.ComponentProps<"div">;

export default function ProblemSubmissionsFilter({
  isDisabled,
  className,
  ...props
}: Readonly<ProblemSubmissionsFilterProps>) {
  const page = useAppSelector((state) => state.problemSubmissions.page);
  const size = useAppSelector((state) => state.problemSubmissions.size);
  const timestamp = useAppSelector(
    (state) => state.problemSubmissions.timestamp
  );
  const totalPages = useAppSelector(
    (state) => state.problemSubmissions.totalPages
  );
  const hasMore = useAppSelector(selectHasMoreSubmissions);
  const isLoading = useAppSelector(selectIsProblemSubmissionsLoading);
  const isLoadingMore = useAppSelector(selectIsLoadingMoreSubmissions);
  return (
    <Card className={cn("h-fit", className)} {...props}>
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
        <p>Has More: {hasMore.toString()}</p>
        <p>Page: {page}</p>
        <p>Size: {size}</p>
        <p>Timestamp: {timestamp}</p>
        <p>Total Pages: {totalPages}</p>
      </CardContent>
    </Card>
  );
}
