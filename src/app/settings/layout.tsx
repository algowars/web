"use client";

import React from "react";
import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthGuard } from "@/features/auth/guards/auth.guard";
import { routerConfig } from "@/router-config";
import { User, Key, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";

  const nav = [
    { label: "Profile", href: routerConfig.settingsProfile.path, icon: User },
    { label: "Account", href: routerConfig.settingsAccount.path, icon: Key },
    {
      label: "Preferences",
      href: routerConfig.settingsPreferences.path,
      icon: Sliders,
    },
  ];

  return (
    <AuthGuard>
      <SidebarLayout
        breadcrumbs={[
          { url: routerConfig.home.path, name: "Home" },
          { url: routerConfig.profileSettings.path, name: "Settings" },
        ]}
        defaultOpen
      >
        <div className="flex flex-col gap-4 md:flex-row">
          {/* nav card (no Sidebar component) */}
          <aside className="w-full md:w-56 shrink-0 self-start">
            <Card className="md:sticky md:top-20 gap-0 ">
              <CardHeader className="px-4">
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="px-2 mt-2">
                <ul className="flex flex-col gap-1">
                  {nav.map((item) => {
                    const active =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/");
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            buttonVariants({
                              variant: active ? "secondary" : "ghost",
                            }),
                            "flex text-start justify-start items-center gap-2 px-3 py-2 rounded-md text-sm w-full"
                          )}
                          aria-current={active ? "page" : undefined}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </aside>

          {/* main content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </SidebarLayout>
    </AuthGuard>
  );
}
