"use client";

import { useState } from "react";
import { useCreateProblemStore } from "./create-problem-store";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function CreateProblemTags() {
  const tags = useCreateProblemStore((s) => s.tags);
  const addTag = useCreateProblemStore((s) => s.addTag);
  const removeTag = useCreateProblemStore((s) => s.removeTag);

  const [value, setValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = value.trim();
      if (!trimmed || tags.includes(trimmed)) return;
      addTag(trimmed);
      setValue("");
    }

    if (e.key === "Backspace" && value === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add tags…"
        className="bg-transparent border rounded-md p-2 focus-visible:ring-2 focus-visible:ring-ring"
      />

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="rounded-sm p-0.5 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
