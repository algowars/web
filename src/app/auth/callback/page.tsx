import React, { Suspense } from "react";
import PageLoader from "@/components/loader/page-loader/page-loader";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import { routerConfig } from "@/router-config";
import AuthCallback from "@/features/auth/auth-callback/auth-callback";

export default async function AuthCallbackPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect(routerConfig.home.path);
  }

  return <AuthCallback />;
}
