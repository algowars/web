import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { CreateProblemSetup } from "../models/create-problem-setup-model";
import { useCreateProblemStore } from "../create-problem-store";

type CreateProblemSetupCardProps = {
  setup: CreateProblemSetup;
  index: number;
};

export default function CreateProblemSetupCard({
  setup,
  index,
}: CreateProblemSetupCardProps) {
  const getLanguageByVersionId = useCreateProblemStore(
    (s) => s.getLanguageByVersionId
  );

  const language = setup.languageVersionIds.length
    ? getLanguageByVersionId(setup.languageVersionIds[0])
    : null;

  console.log("LANGUAGE: ", language, setup);

  if (!language) {
    return (
      <Card>
        <CardHeader>Unknown Language</CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>Language Name: {language.name}</CardHeader>
      <CardDescription></CardDescription>
    </Card>
  );
}
