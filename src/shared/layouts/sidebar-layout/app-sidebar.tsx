"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { routerConfig } from "@/shared/router-config";
import { Command, HomeIcon, Link, Puzzle } from "lucide-react";
import { SidebarMainNav } from "./sidebar-main-nav";
import SidebarAccount from "./sidebar-account";

export default function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  const data = {
    navMain: [
      {
        title: "Home",
        url: routerConfig.dashboard.path,
        icon: HomeIcon,
        isActive: true,
      },
      {
        title: "Problems",
        url: routerConfig.problems.path,
        icon: Puzzle,
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
      </SidebarContent>
      <SidebarFooter>
        <SidebarAccount />
      </SidebarFooter>
    </Sidebar>
  );
}
