"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import Logo from "@/shared/logo/logo";
import { routerConfig } from "@/shared/router-config";
import { ModeToggle } from "@/shared/theme/mode-toggle";
import { useUser } from "@auth0/nextjs-auth0";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const { user } = useUser();
  const defaultRoutes = [
    { name: "Home", href: routerConfig.home.path },
    { name: "Problems", href: routerConfig.problems.path },
  ];

  const unauthenticatedLinks = [
    <Button asChild variant="outline" key="login">
      <Link href={routerConfig.authLogIn.path} data-testid="sign-in-button">
        Log In
      </Link>
    </Button>,
    <Button asChild variant="default" key="signup" data-testid="sign-up-button">
      <Link href={routerConfig.authSignUp.path}>Sign Up</Link>
    </Button>,
  ];

  const authenticatedLinks = [
    <Button asChild variant="outline" key="profile">
      <Link href={routerConfig.profile.path}>Profile</Link>
    </Button>,
    <Button asChild variant="default" key="logout">
      <Link href={routerConfig.authLogOut.path}>Log Out</Link>
    </Button>,
  ];

  const links = user ? authenticatedLinks : unauthenticatedLinks;

  return (
    <nav className="border-b border-dashed">
      <div className="max-w-7xl py-3 mx-auto grid grid-cols-2 md:grid-cols-3 gap-3 px-4">
        <Logo />
        <ul className="hidden justify-self-center md:flex items-center gap-3 text-muted-foreground">
          {defaultRoutes.map((route) => (
            <li key={route.href} className="hidden md:block">
              <Link href={route.href}>{route.name}</Link>
            </li>
          ))}
        </ul>
        <ul className="justify-self-end flex row-reverse md:row items-center gap-2 md:gap-3">
          {links.map((link) => (
            <li key={link.key} className="hidden md:block">
              {link}
            </li>
          ))}
          <li>
            <ModeToggle />
          </li>
          <li className="block md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" aria-label="Open navigation menu">
                  <MenuIcon aria-hidden="true" />
                  <span className="sr-only">Open navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <div className="px-2">
                  <ul className="flex flex-col gap-2">
                    {defaultRoutes.map((route) => (
                      <li key={route.href}>
                        <Button
                          variant="ghost"
                          asChild
                          className="w-full py-5 text-start justify-start"
                        >
                          <Link href={route.href}>{route.name}</Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
                <SheetFooter>
                  {user ? <Button asChild variant="default">
                    <Link href={routerConfig.authLogOut.path}>Log Out</Link>
                  </Button> : <Card className="rounded">
                    <CardHeader>
                      <CardTitle>Join the algowars community</CardTitle>
                      <CardDescription>
                        Sign up to track progress, solve problems, and compete.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-3">
                      <Button asChild variant="outline" className="grow">
                        <Link
                          href={routerConfig.authLogIn.path}
                          data-testid="sign-in-button"
                        >
                          Log In
                        </Link>
                      </Button>
                      <Button asChild variant="default" className="grow">
                        <Link
                          href={routerConfig.authSignUp.path}
                          data-testid="sign-up-button"
                        >
                          Sign Up
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>}
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </li>
        </ul>
      </div>
    </nav>
  );
}
