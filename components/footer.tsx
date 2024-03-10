'use client';
import * as React from 'react';

import type { JSX } from 'react'; // Changed to import type
import { cn } from '@/lib/utils';
import type { AdditionalProps } from './ui';
import { ModeToggle } from './mode-toggle';

/**
 * Renders the footer section of the application
 * @param {AdditionalProps} props - The props object for the Footer component.
 * @param {string} props.className - Optional CSS class to apply to the footer element for custom styling.
 * @returns {JSX.Element} The Footer component with subscription form and social media links.
 */
export function Footer({ className }: AdditionalProps): JSX.Element {
  return (
    <footer className={cn(className)}>
      <div className="w-full px-2 md:px-4 lg:px-6 py-8 bg-secondary flex justify-between items-center ">
        <div className="container flex flex-col items-start text-center">
          <p className="text-md mt-2 text-muted-foreground">
            Built with Next.js, tailwindcss, & shadcn/ui
          </p>
        </div>
        <ModeToggle />
      </div>
    </footer>
  );
}
