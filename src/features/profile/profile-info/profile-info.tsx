"use client";

import React from "react";
import { useProfileContext } from "../profile-context";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import dayjs from "dayjs";
import ProfileInfoEdit from "./profile-info-edit";

export default function ProfileInfo() {
  const { profileAggregate } = useProfileContext();
  const getInitials = (username: string) => {
    return username[0];
  };

  if (!profileAggregate) {
    return null;
  }

  const createdOn = profileAggregate.profile.createdOn
    ? dayjs(profileAggregate.profile.createdOn).format("MMMM D, YYYY")
    : null;

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={profileAggregate.profile.imageUrl}
            alt={`${profileAggregate.profile.username}'s avatar`}
          />
          <AvatarFallback className="text-xs">
            {profileAggregate.profile.imageUrl ? (
              getInitials(profileAggregate.profile.username)
            ) : (
              <User className="h-4 w-4" />
            )}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5">
          <CardTitle>{profileAggregate.profile.username}</CardTitle>
          <CardDescription>{createdOn}</CardDescription>
        </div>
      </CardHeader>
      <div className="absolute top-2 right-2">
        <ProfileInfoEdit />
      </div>
    </Card>
  );
}
