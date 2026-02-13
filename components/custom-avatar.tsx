"use client";

import { useClerk, useUser, UserAvatar } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { History, LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { CustomAvatarProps } from "@/types/custom-avatar.interface";

export default function CustomAvatar({ className }: CustomAvatarProps) {
  const { user } = useUser();
  const clerk = useClerk();
  const router = useRouter();
  const email = user?.primaryEmailAddress?.emailAddress;
  const displayName = user?.fullName ?? "Account";

  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      onClick: () => router.push("/dashboard"),
    },
    {
      key: "history",
      label: "History",
      icon: History,
      onClick: () => router.push("/dashboard/history"),
    },
    {
      key: "settings",
      label: "Settings",
      icon: Settings,
      onClick: () => router.push("/dashboard/settings"),
    },
    {
      key: "manage-account",
      label: "Manage account",
      icon: User,
      onClick: () => clerk.openUserProfile(),
    },
  ];

  const dangerItems = [
    {
      key: "sign-out",
      label: "Sign out",
      icon: LogOut,
      onClick: () => clerk.signOut(),
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "relative inline-flex items-center justify-center rounded-full outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
            className,
          )}
          aria-label="Open user menu"
        >
          <UserAvatar
            appearance={{
              elements: {
                avatarBox:
                  "h-9 w-9 rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-background",
                avatarImage: "rounded-full",
                avatarFallback:
                  "rounded-full bg-muted text-foreground text-xs font-semibold",
              },
            }}
          />
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 z-100 mt-4">
        <DropdownMenuLabel className="space-y-1">
          <span className="block text-sm font-semibold text-foreground">
            {displayName}
          </span>
          {email && (
            <span className="block text-xs text-muted-foreground">{email}</span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuItems.map((item) => (
          <DropdownMenuItem
            key={item.key}
            className="gap-2"
            onClick={item.onClick}
          >
            <item.icon className="size-4" />
            {item.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        {dangerItems.map((item) => (
          <DropdownMenuItem
            key={item.key}
            className="gap-2"
            variant="destructive"
            onClick={item.onClick}
          >
            <item.icon className="size-4" />
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
