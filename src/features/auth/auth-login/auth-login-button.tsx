"use client";

import React from "react";
import { buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { routerConfig } from "@/router-config";
import { usePathname, useSearchParams } from "next/navigation";

export default function AuthLoginButton(
  props: React.ComponentProps<"a"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const returnTo = `${pathname}${search ? `?${search}` : ""}`;
  const loginPath = routerConfig.authLogIn.path.split("?")[0];
  const href = `${loginPath}?returnTo=${encodeURIComponent(returnTo)}`;

  return <a {...props} href={href} />;
}
