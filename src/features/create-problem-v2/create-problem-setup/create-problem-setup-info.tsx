import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { CreateProblemSetup } from "../models/create-problem-setup-model";
import { Input } from "@/components/ui/input";

type CreateProblemSetupInfoProps = {
  setup: CreateProblemSetup;
};

export default function CreateProblemSetupInfo({
  setup,
}: CreateProblemSetupInfoProps) {
  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend>Edit Problem Setup</FieldLegend>
      </FieldSet>
      <FieldGroup>
        <Field>
          <FieldLabel>Initial Code</FieldLabel>
          {setup?.initialCode}
        </Field>
      </FieldGroup>
    </FieldGroup>
  );
}
