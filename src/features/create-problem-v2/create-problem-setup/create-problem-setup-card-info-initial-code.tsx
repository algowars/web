import {
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { CreateProblemSetup } from "../models/create-problem-setup-model";
import { CodeEditor } from "@/components/code-editor/code-editor";

type CreateProblemSetupCardInfoInitialCode = {
  setup: CreateProblemSetup;
  positionalSetupIndex: number;
};

export default function CreateProblemSetupCardInfoInitialCode({
  setup,
  positionalSetupIndex,
}: CreateProblemSetupCardInfoInitialCode) {
  return (
    <FieldSet>
      <FieldLegend>Initial Code</FieldLegend>
      <FieldDescription>
        This is the initial that the user starts with.
      </FieldDescription>
      <FieldGroup>
        <FieldLabel htmlFor={`initial-code-${positionalSetupIndex}`}>
          Initial Code
        </FieldLabel>
        <CodeEditor co />
      </FieldGroup>
    </FieldSet>
  );
}
