import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { RadioGroup } from "@radix-ui/react-dropdown-menu";

export default function ProblemSubmissionsFilter() {
  return (
    <Card>
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
