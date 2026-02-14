import { ReactNode } from 'react';

export interface PageLayoutProps {
  children?: ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'wide';
  hasSidebar?: boolean;
}

export interface PageSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export interface PageSidebarProps {
  children: ReactNode;
  position?: 'left' | 'right';
  className?: string;
}

export interface PageGridProps {
  children: ReactNode;
  className?: string;
}
