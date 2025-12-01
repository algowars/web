"use client";

import { Editor } from "@/components/blocks/editor-x/editor";
import { useCreateProblemStore } from "./create-problem-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateProblemQuestion() {
  const questionState = useCreateProblemStore((s) => s.questionState);
  const changeQuestion = useCreateProblemStore((s) => s.changeQuestion);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question</CardTitle>
      </CardHeader>
      <CardContent>
        <Editor
          editorSerializedState={questionState}
          onSerializedChange={changeQuestion}
          className="bg-card text-card-foreground"
        />
      </CardContent>
    </Card>
  );
}
