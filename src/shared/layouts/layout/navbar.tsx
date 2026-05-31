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
import { MenuIcon } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-dashed">
      <div className="max-w-7xl py-3 mx-auto flex items-center gap-3 justify-between px-4">
        <Logo />
        <ul className="lg:flex items-center gap-3 hidden">
          <li>
            <Link href={routerConfig.home.path}>Home</Link>
          </li>
          <li>
            <Link href={routerConfig.problems.path}>Problems</Link>
          </li>
        </ul>
        <ul className="flex row-reverse lg:row items-center gap-2 lg:gap-3">
          <li className="hidden lg:block">
            <Button asChild variant="outline">
              <Link href={routerConfig.authLogIn.path}>Log In</Link>
            </Button>
          </li>
          <li className="hidden lg:block">
            <Button asChild variant="default">
              <Link href={routerConfig.authSignUp.path}>Sign Up</Link>
            </Button>
          </li>
          <li>
            <ModeToggle />
          </li>
          <li className="block lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost">
                  <MenuIcon />
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
                    <li>
                      <Button
                        variant="ghost"
                        asChild
                        className="w-full py-5 text-start justify-start"
                      >
                        <Link href={routerConfig.home.path}>Home</Link>
                      </Button>
                    </li>
                    <li>
                      <Button
                        variant="ghost"
                        asChild
                        className="w-full py-5 text-start justify-start"
                      >
                        <Link href={routerConfig.problems.path}>Problems</Link>
                      </Button>
                    </li>
                  </ul>
                </div>
                <SheetFooter>
                  <Card className="rounded">
                    <CardHeader>
                      <CardTitle>Join the algowars community</CardTitle>
                      <CardDescription>
                        Sign up to track progress, solve problems, and compete.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-3">
                      <Button asChild variant="outline" className="grow">
                        <Link href={routerConfig.authLogIn.path}>Log In</Link>
                      </Button>
                      <Button asChild variant="default" className="grow">
                        <Link href={routerConfig.authSignUp.path}>Sign Up</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </li>
        </ul>
      </div>
    </nav>
  );
}
