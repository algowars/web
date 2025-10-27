import React from "react";
import { auth0 } from "@/lib/auth0";
import { routerConfig } from "@/router-config";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();

  if (!session) {
    redirect(routerConfig.home.path);
  }

  return <>{children}</>;
}
