"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  PageHeaderProps,
  PageLayoutProps,
  PageSectionProps,
  PageSidebarProps,
} from "@/types/layout/page-layout.interface";

const PageLayout = ({
  children,
  className = "",
  variant = "default",
  hasSidebar = false,
}: PageLayoutProps) => {
  const variants = {
    default: "max-w-6xl",
    compact: "max-w-3xl",
    wide: "max-w-7xl",
  };

  const gridClass = hasSidebar ? "grid grid-cols-1 gap-6 lg:grid-cols-4" : "";
  return (
    <main
      className={cn(
        `
        w-full
        mx-auto px-4
        py-8 sm:py-12 lg:py-16
        ${variants[variant]}
        ${gridClass}
      `,
        className,
      )}
    >
      {children}
    </main>
  );
};

/**
 * PageSection - Semantic section wrapper for content organization
 * Use to group related content with consistent spacing
 */
const PageSection = ({ children, className = "", id }: PageSectionProps) => {
  return (
    <section
      id={id}
      className={`
        space-y-6
        ${className}
      `}
    >
      {children}
    </section>
  );
};

/**
 * PageHeader - Standard header section with title and optional description
 * Provides visual hierarchy and consistent spacing
 */
const PageHeader = ({
  title,
  description,
  className = "",
}: PageHeaderProps) => {
  return (
    <header className={`space-y-2 ${className}`}>
      <h1
        className={cn(
          `
          text-3xl sm:text-4xl lg:text-5xl
          font-bold
          text-neutral-400
          tracking-tight
        `,
          className,
        )}
      >
        {title}
      </h1>
      {description && (
        <p
          className={`
            text-lg
            text-muted-foreground
            leading-relaxed
          `}
        >
          {description}
        </p>
      )}
    </header>
  );
};

/**
 * PageSidebar - Sidebar component for navigation, filters, or secondary content
 * Responsive: stacks on mobile, columns on desktop
 */
const PageSidebar = ({
  children,
  position = "right",
  className = "",
}: PageSidebarProps) => {
  const positionClass =
    position === "left" ? "lg:col-span-1 lg:order-first" : "lg:col-span-1";

  return (
    <aside
      className={`
        ${positionClass}
        sticky top-20
        h-fit
        space-y-4
        ${className}
      `}
    >
      {children}
    </aside>
  );
};

/**
 * PageContent - Main content wrapper (used with PageLayout + PageSidebar)
 * Automatically spans remaining columns
 */
const PageContent = ({ children, className = "" }: PageSectionProps) => {
  return (
    <div
      className={`
        lg:col-span-3
        space-y-6
        ${className}
      `}
    >
      {children}
    </div>
  );
};

/**
 * PageGrid - Grid layout for cards, items, or other repeating content
 * Responsive columns based on breakpoints
 */
interface PageGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const PageGrid = ({ children, columns = 3, className = "" }: PageGridProps) => {
  const columnMap = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={`
        grid
        gap-6
        ${columnMap[columns]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export {
  PageLayout,
  PageSection,
  PageHeader,
  PageSidebar,
  PageContent,
  PageGrid,
};
