"use client";


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
import { useProfileStore } from "../profile-store";

export default function ProfileInfo() {
  const profile = useProfileStore((s) => s.profile);
  const getInitials = (username: string) => {
    return username[0];
  };

  if (!profile) {
    return null;
  }

  const createdOn = profile.createdOn
    ? dayjs(profile.createdOn).format("MMMM D, YYYY")
    : null;

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={profile.imageUrl}
            fallbackSrc="/default-pfp.png"
            alt={`${profile.username}'s avatar`}
          />
          <AvatarFallback className="text-xs">
            {profile.imageUrl ? (
              getInitials(profile.username)
            ) : (
              <User className="h-4 w-4" />
            )}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5">
          <CardTitle>{profile.username}</CardTitle>
          <CardDescription>{createdOn}</CardDescription>
        </div>
      </CardHeader>
      <div className="absolute top-2 right-2">
        <ProfileInfoEdit />
      </div>
    </Card>
  );
}
