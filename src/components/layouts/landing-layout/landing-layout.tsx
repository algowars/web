import React, { ComponentProps, ReactNode } from "react";
import LandingNavbar from "./navbar/landing-navbar";
import LandingFooter from "./footer/landing-footer";
import { cn } from "@/lib/utils";

export interface LandingLayoutProps extends ComponentProps<"div"> {
  children: ReactNode;
  mainClassName?: string;
}

export default function LandingLayout({
  children,
  mainClassName,
  ...props
}: LandingLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background" {...props}>
      <header>
        <LandingNavbar />
      </header>
      <main className={cn("grow", mainClassName)}>{children}</main>
      <LandingFooter />
    </div>
  );
}
