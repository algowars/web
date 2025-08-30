"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { routerConfig } from "@/router-config";
import {
  Command,
  LayoutDashboard,
  ListTree,
  Puzzle,
  Shield,
} from "lucide-react";
import React from "react";
import { SidebarMainNav } from "./sidebar-main-nav";
import { AppSidebarAccount } from "./app-sidebar-account";
import Link from "next/link";
import { useUserRoles } from "@/features/auth/roles/user-roles";
import { PUBLIC_ROLES } from "@/features/auth/public-roles";
import { useAccount } from "@/features/auth/account.context";
import { UnauthenticatedAccount } from "./unauthenticated-account";
import { PartiallyAuthenticatedAccount } from "./partially-authenticated-account";
import { AuthComponentGuard } from "@/features/auth/guards/auth-component.guard";

export default function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  const { roles } = useUserRoles();
  const { isAuthenticated } = useAccount();
  const data = {
    navMain: [
      {
        title: isAuthenticated ? "Dashboard" : "Home",
        url: routerConfig.dashboard.path,
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: "Problems",
        url: routerConfig.problems.path,
        icon: Puzzle,
      },
      ...(roles.includes(PUBLIC_ROLES.ADMIN)
        ? [
            {
              title: "Admin",
              url: routerConfig.admin.path,
              icon: Shield,
            },
          ]
        : []),
    ],
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={routerConfig.dashboard.path}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Algowars</span>
                  <span className="truncate text-xs">Competitive Coding</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMainNav items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <AuthComponentGuard
          unauthenticated={<UnauthenticatedAccount />}
          partiallyAuthenticated={<PartiallyAuthenticatedAccount />}
        >
          <AppSidebarAccount />
        </AuthComponentGuard>
      </SidebarFooter>
    </Sidebar>
  );
}
