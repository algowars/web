import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateProblemStore } from "./create-problem-store";

export default function CreateProblemMetadata() {
  const title = useCreateProblemStore((s) => s.title);
  const changeTitle = useCreateProblemStore((s) => s.changeTitle);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metadata</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <Label>Title</Label>
          <Input
            value={title}
            onChange={({ target: { value } }) => changeTitle(value)}
            placeholder="Title"
          />
        </div>
      </CardContent>
    </Card>
  );
}
