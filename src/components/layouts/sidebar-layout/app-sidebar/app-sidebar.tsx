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
import { accountStore } from "@/features/account/account-store";
import { Command } from "@/components/ui/command";
import Link from "next/link";
import { SidebarMainNav } from "./sidebar-main-nav";
import { UnauthenticatedAccount } from "./unauthenticated-account";
import { AppSidebarAccount } from "./app-sidebar-account";
import { Permissions } from "@/features/auth/permissions/models/permissions";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  const account = accountStore((state) => state.account);
  const isLoading = accountStore((state) => state.isLoading);
  const data = {
    navMain: [
      {
        title: account !== null ? "Dashboard" : "Home",
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
        url: routerConfig.problemManagement.path,
      },
    ],
  };

  function renderFooter() {
    if (isLoading) {
      return (
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" disabled>
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="grid flex-1 gap-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      );
    }

    if (account === null) {
      return <UnauthenticatedAccount />;
    }

    return <AppSidebarAccount />;
  }

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
        {account?.permissions?.includes(Permissions.ReadProblem) ? (
          <SidebarMainNav
            items={data.navProblemManagement}
            title="Problem Management"
          />
        ) : null}
      </SidebarContent>
      <SidebarFooter>{renderFooter()}</SidebarFooter>
    </Sidebar>
  );
}
