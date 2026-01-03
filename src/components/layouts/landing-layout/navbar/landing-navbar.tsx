"use client";

import AppLogo from "@/components/logos/app-logo";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { routerConfig } from "@/router-config";
import Link from "next/link";
import { useAccount, AuthStatus } from "@/features/auth/account.context";
import { Button, buttonVariants } from "@/components/ui/button";
import { LogOut, Menu, User } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

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
            "h-8 text-sm px-3",
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
      <div className="container mx-auto flex items-center">
        <Link href={routerConfig.home.path}>
          <AppLogo />
        </Link>
        <ul className="flex items-center gape-3 md:gap-5 ml-auto">
          <li className="hidden md:inline">
            <Link
              className="text-muted-foreground hover:text-primary text-sm"
              href={routerConfig.home.path}
            >
              Home
            </Link>
          </li>
          <li className="hidden md:inline">
            <Link
              className="text-muted-foreground hover:text-primary text-sm"
              href={routerConfig.problems.path}
            >
              Problems
            </Link>
          </li>
          <li className="hidden md:inline">
            <AuthButtons />
          </li>
          <li>
            <ModeToggle />
          </li>
          <li className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <AppLogo />
                </SheetHeader>
                <SheetDescription className="px-3 h-full flex flex-col pb-3">
                  <div className="flex flex-col gap-3">
                    <Link
                      href={routerConfig.home.path}
                      className="rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                      Home
                    </Link>
                    <Link
                      href={routerConfig.problems.path}
                      className="rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                      Problems
                    </Link>
                  </div>
                  <div className="mt-4 rounded-lg border bg-card p-4 mt-auto">
                    <h3 className="text-sm font-semibold">
                      Join the community
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Sign in to track progress, solve problems, and compete.
                    </p>

                    <div className="mt-4 flex items-center gap-2">
                      <AuthLoginButton
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "flex-1",
                        )}
                      >
                        Sign In
                      </AuthLoginButton>

                      <AuthSignupButton
                        className={cn(
                          buttonVariants({ variant: "secondary" }),
                          "flex-1",
                        )}
                      >
                        Sign Up
                      </AuthSignupButton>
                    </div>
                  </div>
                </SheetDescription>
              </SheetContent>
            </Sheet>
          </li>
        </ul>
      </div>
    </nav>
  );
}
