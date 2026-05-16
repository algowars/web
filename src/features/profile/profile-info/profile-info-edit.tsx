"use client";

import { buttonVariants } from "@/components/ui/button";
import { accountStore } from "@/features/account/account-store";
import Link from "next/link";
import { routerConfig } from "@/router-config";
import { cn } from "@/lib/utils";
import { useProfileStore } from "../profile-store";

export default function ProfileInfoEdit() {
  const profile = useProfileStore((s) => s.profile);
  const account = accountStore((state) => state.account);

  if (
    !profile ||
    !account?.username ||
    profile.username !== account.username
  ) {
    return null;
  }

  return (
    <Link
      href={routerConfig.profileSettings.path}
      className={cn(buttonVariants({ variant: "secondary" }), "h-7 px-3")}
    >
      Edit Profile
    </Link>
  );
}
