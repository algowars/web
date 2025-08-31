"use client";

import SidebarLayout from "@/components/layouts/sidebar-layout/sidebar-layout";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AuthGuard } from "@/features/auth/guards/auth.guard";
import { routerConfig } from "@/router-config";
import Link from "next/link";
import { User, Key, Sliders } from "lucide-react";
import { usePathname } from "next/navigation";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";

  const data = {
    nav: [
      { label: "Profile", href: routerConfig.settingsProfile.path, icon: User },
      { label: "Account", href: routerConfig.settingsAccount.path, icon: Key },
      {
        label: "Preferences",
        href: routerConfig.settingsPreferences.path,
        icon: Sliders,
      },
    ],
  };

  return (
    <AuthGuard>
      <SidebarLayout
        breadcrumbs={[
          {
            url: routerConfig.home.path,
            name: "Home",
          },
          {
            url: routerConfig.profileSettings.path,
            name: "Settings",
          },
        ]}
        defaultOpen={true}
      >
        <div className="flex flex-col gap-4 md:flex-row">
          <aside className="w-full md:w-56 shrink-0">
            <Card className="h-full gap-1">
              <CardHeader className="px-4">
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <SidebarProvider>
                <Sidebar collapsible="none">
                  <SidebarContent>
                    <SidebarGroup>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          {data.nav.map((item) => {
                            const active =
                              pathname === item.href ||
                              pathname.startsWith(item.href + "/");
                            return (
                              <SidebarMenuItem key={item.label}>
                                <SidebarMenuButton asChild>
                                  <Link
                                    href={item.href}
                                    className={`flex items-center gap-2 px-2 py-2 rounded-md w-full text-sm ${
                                      active
                                        ? "bg-primary text-primary-foreground font-semibold"
                                        : "hover:bg-muted/60"
                                    }`}
                                  >
                                    <item.icon className="h-4 w-4" />
                                    <span className="text-sm">
                                      {item.label}
                                    </span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            );
                          })}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  </SidebarContent>
                </Sidebar>
              </SidebarProvider>
            </Card>
          </aside>

          {/* Right: main content card */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </SidebarLayout>
    </AuthGuard>
  );
}
