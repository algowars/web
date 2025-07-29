"use client";

import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { routerConfig } from "@/router-config";

type CreatedBy = {
  id: string;
  username: string;
  imageUrl?: string;
};

type ProblemEditorCreatedByProps = {
  createdBy: CreatedBy;
  className?: string;
};

export default function ProblemEditorCreatedBy({
  createdBy,
  className = "",
}: ProblemEditorCreatedByProps) {
  const getInitials = (username: string) => {
    return username[0];
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-sm font-medium text-muted-foreground">Created by</h3>
      <Link
        href={routerConfig.profile.execute({ username: createdBy.username })}
        className="flex items-center gap-3 hover:bg-accent hover:text-accent-foreground rounded-md p-2 transition-colors cursor-pointer"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={createdBy.imageUrl}
            alt={`${createdBy.username}'s avatar`}
          />
          <AvatarFallback className="text-xs">
            {createdBy.imageUrl ? (
              getInitials(createdBy.username)
            ) : (
              <User className="h-4 w-4" />
            )}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{createdBy.username}</span>
      </Link>
    </div>
  );
}
