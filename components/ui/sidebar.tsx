"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  const collapseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  return (
    <>
      <motion.div
        ref={sidebarRef}
        className={cn(
          "h-dvh px-4 py-4 hidden  md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800  shrink-0",
          className
        )}
        animate={{
          width: animate ? (open ? "200px" : "60px") : "300px",
        }}
        onPointerEnter={() => {
          if (collapseTimeoutRef.current) {
            clearTimeout(collapseTimeoutRef.current);
            collapseTimeoutRef.current = null;
          }
          setOpen(true);
        }}
        onPointerLeave={(event) => {
          if (!animate) {
            return;
          }
          const relatedTarget = event.relatedTarget as Node | null;
          if (relatedTarget && sidebarRef.current?.contains(relatedTarget)) {
            return;
          }
          collapseTimeoutRef.current = setTimeout(() => {
            if (sidebarRef.current?.matches(":hover")) {
              return;
            }
            setOpen(false);
          }, 1000);
        }}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

type MobileSidebarProps = React.ComponentProps<"div"> & {
  showTrigger?: boolean;
  topBarClassName?: string;
};

export const MobileSidebar = ({
  className,
  children,
  showTrigger = true,
  topBarClassName,
  ...props
}: MobileSidebarProps) => {
  const { open, setOpen } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  if (!isMobile) {
    return null;
  }
  return (
    <>
      {showTrigger ? (
        <div
          className={cn(
            "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full",
            topBarClassName
          )}
          {...props}
        >
          <div className="flex justify-end z-20 w-full">
            <IconMenu2
              className="text-neutral-800 dark:text-neutral-200"
              onClick={() => setOpen(!open)}
            />
          </div>
        </div>
      ) : null}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-100 flex flex-col justify-between",
              className
            )}
          >
            <div
              className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
              onClick={() => setOpen(!open)}
            >
              <IconX />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  const pathname = usePathname();
  const isActive = pathname === link.href;
  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar rounded-lg px-2 py-2 transition",
        isActive
          ? "bg-primary/10 text-foreground"
          : "hover:bg-muted/60",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-md",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      >
        {link.icon}
      </span>

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className={cn(
          "text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block p-0 m-0",
          isActive ? "text-foreground" : "text-neutral-700 dark:text-neutral-200"
        )}
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
