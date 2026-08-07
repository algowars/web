"use client";

import {
  selectAvatarUrl,
  selectDisplayName,
  selectIsUserLoading,
  selectUser,
  selectUserSyncFailed,
} from "@/domains/user/state/user-slice";
import { UserEvents } from "@/domains/user/state/user-actions";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { routerConfig } from "@/shared/router-config";
import { useAppDispatch, useAppSelector } from "@/shared/state/hooks";
import { useUser } from "@auth0/nextjs-auth0";
import {
  AlertCircle,
  ChevronsUpDown,
  LogOut,
  Monitor,
  Moon,
  RefreshCw,
  Settings2,
  Sun,
  User,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function SidebarUser() {
  const dispatch = useAppDispatch();
  const { user: authUser, isLoading } = useUser();
  const user = useAppSelector(selectUser);
  const isUserLoading = useAppSelector(selectIsUserLoading);
  const displayName = useAppSelector(selectDisplayName);
  const avatarUrl = useAppSelector(selectAvatarUrl);
  const syncFailed = useAppSelector(selectUserSyncFailed);
  const { isMobile } = useSidebar();
  const { setTheme } = useTheme();

  if (isLoading || isUserLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <Skeleton className="h-8 w-8 " />
            <div className="grid flex-1 gap-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!authUser) {
    return (
      <Card className="rounded">
        <CardHeader>
          <CardTitle>Join the algowars community</CardTitle>
          <CardDescription>
            Sign up to track progress and solve problems.
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
    );
  }

  // authUser (Auth0 session) can exist even when the app-level user profile failed
  // to sync (e.g. the API was cold-starting when the PUT went out). displayName/
  // avatarUrl fall back to the Auth0 profile in that case, so the sidebar still shows
  // a name and picture instead of going blank.
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild data-cy="user-dropdown-trigger">
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="relative">
                <Avatar className="h-8 w-8 ">
                  <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
                  <AvatarFallback>{displayName?.[0] ?? "U"}</AvatarFallback>
                </Avatar>
                {syncFailed ? (
                  <AlertCircle className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-background text-muted-foreground" />
                ) : null}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                {syncFailed ? (
                  <span className="truncate text-xs text-muted-foreground">
                    Profile unavailable
                  </span>
                ) : null}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 "
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 ">
                  <AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
                  <AvatarFallback>{displayName?.[0] ?? "U"}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  {user?.roles.includes("admin") ? (
                    <span className="text-xs text-muted-foreground">Admin</span>
                  ) : null}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {syncFailed ? (
              <>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    dispatch(UserEvents.retrySyncRequested());
                  }}
                >
                  <RefreshCw />
                  Retry loading profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            ) : null}
            {user?.username ? (
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link
                    href={routerConfig.profile.execute({
                      username: user?.username,
                    })}
                  >
                    <User />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={routerConfig.profileSettings.path}>
                    <Settings2 />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            ) : null}
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Appearance</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onSelect={() => setTheme("light")}>
                  <Sun />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setTheme("dark")}>
                  <Moon />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setTheme("system")}>
                  <Monitor />
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Button
                asChild
                variant="ghost"
                className="flex justify-start items-center"
              >
                <Link href={routerConfig.authLogOut.path}>
                  <LogOut />
                  Log Out
                </Link>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
