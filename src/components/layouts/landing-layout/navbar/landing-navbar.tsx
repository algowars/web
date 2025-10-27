"use client";

import AppLogo from "@/components/logos/app-logo";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { routerConfig } from "@/router-config";
import Link from "next/link";
import React from "react";
import { useAccount, AuthStatus } from "@/features/auth/account.context";
import { Button, buttonVariants } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AuthLoginButton from "@/features/auth/auth-login/auth-login-button";
import AuthSignupButton from "@/features/auth/auth-signup/auth-signup-button";
import { cn } from "@/lib/utils";
import AuthLogout from "@/features/auth/auth-logout/auth-logout";

function AuthButtons() {
  const { authStatus, account } = useAccount();

  if (authStatus === AuthStatus.UNAUTHENTICATED) {
    return (
      <div className="flex items-center gap-2">
        <AuthLoginButton
          variant="link"
          className="text-muted-foreground hover:text-primary pl-0 pr-3 text-sm hover:no-underline"
        >
          Sign In
        </AuthLoginButton>
        <AuthSignupButton
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "h-8 text-sm px-3"
          )}
        >
          Sign Up
        </AuthSignupButton>
      </div>
    );
  }

  if (
    authStatus === AuthStatus.FULLY_AUTHENTICATED ||
    authStatus === AuthStatus.PARTIALLY_AUTHENTICATED
  ) {
    const displayName = account?.username ?? "User";
    const userInitials = displayName.slice(0, 2).toUpperCase();

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={account?.imageUrl} alt={displayName} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {account?.username ? (
            <DropdownMenuItem asChild>
              <Link
                href={routerConfig.profile.execute({
                  username: account.username,
                })}
                className="flex items-center"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="text-destructive">
            <AuthLogout>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </AuthLogout>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return null;
}

export default function LandingNavbar() {
  return (
    <nav className="p-3">
      <div className="mx-auto max-w-7xl flex items-center">
        <Link href={routerConfig.home.path}>
          <AppLogo />
        </Link>
        <ul className="flex items-center gap-5 ml-auto">
          <li>
            <Link
              className="text-muted-foreground hover:text-primary text-sm"
              href={routerConfig.home.path}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className="text-muted-foreground hover:text-primary text-sm"
              href={routerConfig.problems.path}
            >
              Problems
            </Link>
          </li>
          <li className="flex items-center">
            <AuthButtons />
          </li>
          <li>
            <ModeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
}
