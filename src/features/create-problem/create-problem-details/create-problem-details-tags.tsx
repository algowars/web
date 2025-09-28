"use client";

import React, { useState, KeyboardEvent } from "react";
import { useCreateProblemContext } from "../create-problem-context";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export default function CreateProblemTags() {
  const { createProblem, updateCreateProblem } = useCreateProblemContext();
  const [inputValue, setInputValue] = useState("");

  const MAX_TAGS = 5;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " " || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      createProblem.tags.length > 0
    ) {
      removeTag(createProblem.tags.length - 1);
    }
  };

  const addTag = () => {
    const tag = inputValue.trim().toLowerCase();
    if (
      tag &&
      !createProblem.tags.includes(tag) &&
      createProblem.tags.length < MAX_TAGS
    ) {
      updateCreateProblem({ tags: [...createProblem.tags, tag] });
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = createProblem.tags.filter((_, i) => i !== index);
    updateCreateProblem({ tags: newTags });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="tags">
        Tags ({createProblem.tags.length}/{MAX_TAGS})
      </Label>
      <div className="flex flex-wrap items-center gap-1 p-2 rounded-md min-h-[40px] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {createProblem.tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            {tag}
            <button onClick={() => removeTag(index)}>
              <X className="w-3 h-3 cursor-pointer hover:text-destructive" />
            </button>
          </Badge>
        ))}
        {createProblem.tags.length < MAX_TAGS && (
          <Input
            id="tags"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={addTag}
            placeholder={
              createProblem.tags.length === 0
                ? "Enter tags (press Enter, Space, or Comma to add)"
                : "Add tag..."
            }
            className="flex-1 min-w-[120px] outline-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        )}
      </div>
      {createProblem.tags.length >= MAX_TAGS && (
        <p className="text-sm text-muted-foreground mt-1">
          Maximum of {MAX_TAGS} tags reached
        </p>
      )}
    </div>
  );
}
