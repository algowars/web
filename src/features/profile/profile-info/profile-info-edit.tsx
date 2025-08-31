"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { useProfileContext } from "../profile-context";
import { useAccount } from "@/features/auth/account.context";
import Link from "next/link";
import { routerConfig } from "@/router-config";
import { cn } from "@/lib/utils";

export default function ProfileInfoEdit() {
  const { profileAggregate } = useProfileContext();
  const { account } = useAccount();

  const isOwner = profileAggregate?.profile.username === account?.username;

  console.log(
    profileAggregate?.profile,
    account,
    !profileAggregate?.profile || !account?.username || !isOwner
  );

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
