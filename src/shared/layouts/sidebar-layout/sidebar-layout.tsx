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
          <div className={cn("px-4 pb-4 h-full", className)}>{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
