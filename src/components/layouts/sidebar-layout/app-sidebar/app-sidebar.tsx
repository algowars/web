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
import { BookOpenText, LayoutDashboard, Puzzle } from "lucide-react";
import React from "react";
import { useAccount } from "@/features/auth/account.context";
import { Command } from "@/components/ui/command";
import Link from "next/link";
import { SidebarMainNav } from "./sidebar-main-nav";
import { AuthComponentGuard } from "@/features/auth/guards/auth-component.guard";
import { UnauthenticatedAccount } from "./unauthenticated-account";
import { PartiallyAuthenticatedAccount } from "./partially-authenticated-account";
import { AppSidebarAccount } from "./app-sidebar-account";
import { Permissions } from "@/features/auth/permissions/Permissions";
export default function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  const { isAuthenticated, account } = useAccount();
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
    ],
    navProblemManagement: [
      {
        title: "Problems",
        icon: BookOpenText,
        url: routerConfig.problemMangement.path,
      },
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
        {account?.permissions.includes(Permissions.ReadProblem) ? (
          <SidebarMainNav
            items={data.navProblemManagement}
            title="Problem Management"
          />
        ) : null}
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
