import { Editor } from "@/components/blocks/editor-x/editor";
import { useCreateProblemStore } from "./create-problem-store";

export default function CreateProblemQuestion() {
  const question = useCreateProblemStore((s) => s.question);
  const changeQuestion = useCreateProblemStore((s) => s.changeQuestion);

  return (
    <Editor
      editorStdate={question}
      onChange={(state) => changeQuestion(state)}
    />
  );
}
