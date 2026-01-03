import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateProblemStore } from "./create-problem-store";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

export default function CreateProblemMetadata() {
  const title = useCreateProblemStore((s) => s.title);
  const difficulty = useCreateProblemStore((s) => s.difficulty);
  const changeTitle = useCreateProblemStore((s) => s.changeTitle);
  const changeDifficulty = useCreateProblemStore((s) => s.changeDifficulty);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metadata</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <FieldSet>
            <FieldGroup className="grid grid-cols-2">
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  value={title}
                  onChange={({ target: { value } }) => changeTitle(value)}
                  placeholder="Title"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="difficulty">
                  Estimated Difficulty
                </FieldLabel>
                <Input
                  id="difficulty"
                  type="number"
                  value={difficulty}
                  onChange={({ target: { value } }) =>
                    changeDifficulty(Number(value))
                  }
                  placeholder="Estimated Difficulty"
                  required
                />
                <FieldDescription>
                  Difficulty rating for the problem (less than 1000 = Easy,
                  1000-2000 = Medium, 2000 greater = Hard)
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
