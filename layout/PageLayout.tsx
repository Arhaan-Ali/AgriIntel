'use client'

import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'

import type {
  PageLayoutProps,
  PageSectionProps,
  PageHeaderProps,
  PageSidebarProps,
  PageGridProps
} from '@/types/layout/page-layout.interface';

/**
 * PageLayout - Reusable page container with semantic structure
 * 
 * Supports multiple layout patterns:
 * - Simple content wrapping
 * - Sidebar layouts (left/right)
 * - Section-based content organization
 * 
 * All styling follows Tailwind v4 utility-first approach with
 * mobile-first responsive design and dark mode support.
 */


/**
 * PageHeader - Standard header section with title and optional description
 * Provides visual hierarchy and consistent spacing
 */
const PageHeader = ({
  title,
  description,
  className = '',
}: PageHeaderProps) => {
  return (
    <header className={`space-y-2 ${className}`}>
      <h1
        className={cn(`
          text-3xl sm:text-4xl lg:text-5xl
          font-bold
          text-neutral-400
          tracking-tight
        `, className)}
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
  )
}

/**
 * PageSidebar - Sidebar component for navigation, filters, or secondary content
 * Responsive: stacks on mobile, columns on desktop
 */
const PageSidebar = ({
  children,
  position = 'right',
  className = '',
}: PageSidebarProps) => {
  const positionClass = position === 'left' ? 'lg:col-span-1 lg:order-first' : 'lg:col-span-1'

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
  )
}

/**
 * PageContent - Main content wrapper (used with PageLayout + PageSidebar)
 * Automatically spans remaining columns
 */
const PageContent = ({ children, className = '' }: PageSectionProps) => {
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
  )
}

/**
 * PageGrid - Grid layout for cards, items, or other repeating content

const PageGrid = ({ children, columns = 3, className = '' }: PageGridProps) => {
  const columnMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

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
  )
}

export {
  PageLayout,
  PageSection,
  PageHeader,
  PageSidebar,
  PageContent,
  PageGrid,
}
**/