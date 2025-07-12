import AppLogo from "@/components/logos/app-logo";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { routerConfig } from "@/router-config";
import Link from "next/link";
import React from "react";

export default function LandingNavbar() {
  return (
    <nav className="p-3">
      <div className="mx-auto max-w-7xl flex items-center">
        <Link href={routerConfig.home.path}>
          <AppLogo />
        </Link>
        <ul className="flex items-center gap-5 ml-auto">
          <li className="text-muted-foreground hover:text-primary">
            <Link href={routerConfig.home.path}>Home</Link>
          </li>
          <li className="text-muted-foreground hover:text-primary">
            <Link href={routerConfig.problems.path}>Problems</Link>
          </li>
          <li>
            <ModeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
}
