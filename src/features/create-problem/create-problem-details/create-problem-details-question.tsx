"use client";

import React, { useState } from "react";
import { useCreateProblemContext } from "../create-problem-context";
import { Label } from "@/components/ui/label";
import { SerializedEditorState } from "lexical";
import { Editor } from "@/components/blocks/editor-x/editor";

const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

export default function CreateProblemDetailsQuestion() {
  const { createProblem, updateCreateProblem } = useCreateProblemContext();
  const [editorState, setEditorState] = useState<SerializedEditorState>(
    createProblem.question ? JSON.parse(createProblem.question) : initialValue
  );

  const handleEditorChange = (value: SerializedEditorState) => {
    setEditorState(value);
    updateCreateProblem({ question: JSON.stringify(value) });
  };

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="question">Question</Label>
      <Editor
        editorSerializedState={editorState}
        onSerializedChange={handleEditorChange}
        className="bg-card text-card-foreground"
      />
    </div>
  );
}
