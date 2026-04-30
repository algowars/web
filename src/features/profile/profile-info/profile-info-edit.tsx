"use client";

import { buttonVariants } from "@/components/ui/button";
import { useProfileContext } from "../profile-context";
import { accountStore } from "@/features/account/account-store";
import Link from "next/link";
import { routerConfig } from "@/router-config";
import { cn } from "@/lib/utils";

export default function ProfileInfoEdit() {
  const { profileAggregate } = useProfileContext();
  const account = accountStore((state) => state.account);

  const isOwner = profileAggregate?.profile.username === account?.username;

  if (!profileAggregate?.profile || !account?.username || !isOwner) {
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
