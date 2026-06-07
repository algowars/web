import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import React, { ReactNode } from "react";
import AppSidebar from "./app-sidebar";
import AppSidebarHeader, { BreadcrumbItem } from "./app-sidebar-header";
import { cn } from "@/shared/lib/utils";
import { TooltipProvider } from "@/shared/components/ui/tooltip";

type SidebarProps = {
  breadcrumbs: BreadcrumbItem[];
  children?: ReactNode;
  defaultOpen?: boolean;
  headerItems?: React.ReactNode;
  className?: string;
};

export default function SidebarLayout({
  breadcrumbs,
  children,
  defaultOpen,
  headerItems,
  className,
}: SidebarProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <AppSidebarHeader
            breadcrumbs={breadcrumbs}
            headerItems={headerItems}
          />
          <div
            className={cn(
              "px-2 md:px-4 pb-2 md:pb-4 flex-1 min-h-0 overflow-hidden",
              className
            )}
          >
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
