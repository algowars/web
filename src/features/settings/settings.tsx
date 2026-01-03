"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { User, Key, Sliders } from "lucide-react";
import { routerConfig } from "@/router-config";

type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export default function Settings({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  const nav: NavItem[] = [
    {
      label: "Profile",
      href: routerConfig.settingsProfile.path,
      icon: <User className="size-4" />,
    },
    {
      label: "Account",
      href: routerConfig.settingsAccount.path,
      icon: <Key className="size-4" />,
    },
    {
      label: "Preferences",
      href: routerConfig.settingsPreferences.path,
      icon: <Sliders className="size-4" />,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <aside className="w-full md:w-56 shrink-0">
            <nav className="rounded-md border bg-muted p-2">
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
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                          active
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "hover:bg-muted/60"
                        )}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          <section className="flex-1 min-w-0">
            <div className="rounded-md border p-4">
              {children ?? (
                <div className="text-sm text-muted-foreground">
                  Select a setting from the sidebar.
                </div>
              )}
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
