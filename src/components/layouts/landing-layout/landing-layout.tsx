import React, { ComponentProps, ReactNode } from "react";
import LandingNavbar from "./navbar/landing-navbar";
import LandingFooter from "./footer/landing-footer";
import { cn } from "@/lib/utils";
import AccountVerificationBanner from "@/features/auth/account-verification-banner/account-verification-banner";

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
        <AccountVerificationBanner />
        <LandingNavbar />
      </header>
      <main
        id="main-content"
        className={cn("grow", mainClassName)}
        tabIndex={-1}
      >
        {children}
      </main>
      <LandingFooter />
    </div>
  );
}
