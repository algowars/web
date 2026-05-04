import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ProblemSubmissionsFilter(
  props: React.ComponentProps<"div">
) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Filter</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup defaultValue="all-solutions">
          <div className="flex items-center gap-3">
            <RadioGroupItem value="all-solutions" id="all-solutions" />
            <Label htmlFor="all-solutions">All Solutions</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="my-submissions" id="my-submissions" />
            <Label htmlFor="my-submissions">My Submissions</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
