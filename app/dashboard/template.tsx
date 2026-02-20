"use client";

import React from "react";
import ThemeToggle from "@/components/theme-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DesktopSidebar,
  MobileSidebar,
  Sidebar,
  SidebarLink,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Leaf,
  LayoutDashboard,
  History,
  Settings,
  Menu,
  MessageCircle,
} from "lucide-react";

const sidebarLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4 text-primary" />,
  },
  {
    label: "Chatbot",
    href: "/dashboard/chatbot",
    icon: <MessageCircle className="h-4 w-4 text-muted-foreground" />,
  },
  {
    label: "History",
    href: "/dashboard/history",
    icon: <History className="h-4 w-4 text-muted-foreground" />,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-4 w-4 text-muted-foreground" />,
  },
];

const breadcrumbLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/chatbot": "Chatbot",
  "/dashboard/history": "History",
  "/dashboard/settings": "Settings",
};

const DashboardNav = () => {
  const { setOpen } = useSidebar();
  const pathname = usePathname();
  const breadcrumbLabel = breadcrumbLabels[pathname ?? ""] ?? "Dashboard";

  return (
    <nav className="flex justify-center h-14 items-center border-b border-border/60 bg-neutral-100 dark:bg-neutral-800 px-6 py-2 sticky top-0 z-50">
      <div className="flex items-center justify-between w-full">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-lg border border-border/60 bg-card/70 p-2 text-foreground shadow-sm transition hover:bg-muted/60 sm:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-foreground w-full sm:w-fit justify-center sm:justify-start"
        >
          <Leaf className="h-5 w-5 text-primary" />
          LOGO
        </Link>
        <div className="flex justify-center w-fit">
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{breadcrumbLabel}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center justify-end">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sidebar>
      <div className="h-dvh bg-background w-full overflow-hidden">
        <DashboardNav />
        <div className="flex h-[calc(100dvh-3.5rem)]">
          <DesktopSidebar className="border-r border-border/60 sticky top-14 h-[calc(100dvh-3.5rem)]">
            <div className="space-y-1">
              {sidebarLinks.map((link) => (
                <SidebarLink key={link.href} link={link} />
              ))}
            </div>
          </DesktopSidebar>
          <MobileSidebar showTrigger={false} className="bg-background">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold text-foreground">
                  LOGO
                </span>
              </div>
              <div className="space-y-2">
                {sidebarLinks.map((link) => (
                  <SidebarLink key={link.href} link={link} />
                ))}
              </div>
            </div>
          </MobileSidebar>
          <main className="flex-1 overflow-y-auto bg-background/80">
            <div className="flex-1 px-4 py-4">{children}</div>
          </main>
        </div>
      </div>
    </Sidebar>
  );
}
