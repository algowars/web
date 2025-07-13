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
import { Command, DumbbellIcon, ListTree, SquareTerminal } from "lucide-react";
import React from "react";
import { SidebarMainNav } from "./sidebar-main-nav";
import { AppSidebaraccount } from "./app-sidebar-user";

export default function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: routerConfig.dashboard.path,
        icon: SquareTerminal,
        isActive: true,
      },
      {
        title: "Problems",
        url: routerConfig.problems.path,
        icon: ListTree,
      },
    ],
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMainNav items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <AppSidebaraccount />
      </SidebarFooter>
    </Sidebar>
  );
}
